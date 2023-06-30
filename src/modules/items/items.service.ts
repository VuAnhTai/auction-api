import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { StatusEnum, TypeEnum, TypeFilter } from '../../common/enums';
import { CacheService } from '@/providers/redis/redis.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT } from '@/common/constants';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly cacheService: CacheService,
    private schedulerRegistry: SchedulerRegistry,
    private eventEmitter: EventEmitter2
  ) {}

  async findAll(type: TypeFilter): Promise<Item[]> {
    let where = {};
    if (type === TypeFilter.COMPLETED) {
      where = { type: TypeEnum.COMPLETED };
    }

    if (type === TypeFilter.ONGOING) {
      where = { type: TypeEnum.PUBLISHED };
    }

    return await this.itemRepository.find({
      where,
      order: { id: 'DESC' },
      relations: ['owner'],
      select: {
        id: true,
        name: true,
        startPrice: true,
        currentPrice: true,
        startDate: true,
        endDate: true,
        duration: true,
        status: true,
        type: true,
        owner: {
          id: true,
          email: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Item> {
    return await this.itemRepository.findOne({
      where: { id, status: StatusEnum.ACTIVE },
    });
  }

  async create(item: Item): Promise<Item> {
    return this.itemRepository.save({
      ...item,
      startPrice: item.currentPrice,
    });
  }

  async update(id: number, item: Item): Promise<any> {
    return this.itemRepository.update(id, item);
  }

  async publishedItem(id: number): Promise<any> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // using scheduler to update status of item
    const timeout = setTimeout(() => {
      this.completeItem(item.id);
    }, item.duration * 1000);

    this.schedulerRegistry.addTimeout(`item:${id}`, timeout);

    return this.itemRepository.update(id, {
      type: TypeEnum.PUBLISHED,
      startDate: new Date(),
      endDate: new Date(Date.now() + item.duration * 1000),
    });
  }

  async completeItem(id: number): Promise<any> {
    const item = await this.itemRepository.findOne({ where: { id }, relations: ['owner'] });
    this.eventEmitter.emit(EVENT.BID.COMPLETED, item);

    return this.itemRepository.update(id, {
      type: TypeEnum.COMPLETED,
    });
  }

  async bid(id: number, { amount }: { amount: number }, user: any): Promise<any> {
    // using redis to check highest bid and update current price
    // prevent race condition
    const key = `item:${id}:highestBid`;
    await this.cacheService.watch(key);
    const highestBid = +(await this.cacheService.get(key));
    if (highestBid && highestBid >= amount) {
      throw new InternalServerErrorException('Current price must be higher than current price');
    }

    const multi = await this.cacheService.multi();
    multi.set(key, amount);
    multi.exec();

    const itemDB = await this.itemRepository.findOne({
      where: { id, status: StatusEnum.ACTIVE },
      relations: ['owner'],
    });

    if (!itemDB || itemDB.type !== TypeEnum.PUBLISHED) {
      throw new InternalServerErrorException('Item is not public');
    }

    if (itemDB.endDate < new Date()) {
      if (itemDB.type === TypeEnum.PUBLISHED) {
        await this.completeItem(id);
      }

      throw new InternalServerErrorException('Item is expired');
    }

    if (+itemDB.owner.id === +user.id) {
      throw new InternalServerErrorException('You are owner of item');
    }

    if (itemDB.currentPrice >= amount || amount < itemDB.startPrice) {
      throw new InternalServerErrorException('Current price must be higher than current price');
    }

    await this.itemRepository.update(id, {
      currentPrice: amount,
      owner: user,
    });

    const updateItem = await this.itemRepository.findOne({
      where: { id, status: StatusEnum.ACTIVE },
    });

    this.eventEmitter.emit(EVENT.USER.UPDATE_AMOUNT, {
      item: updateItem,
      userId: user.id,
      amount,
    });

    return updateItem;
  }
}
