import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
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
    if (type === TypeFilter.COMPLETED) {
      return this.itemRepository.find({
        where: { endDate: LessThan(new Date()) },
      });
    }

    if (type === TypeFilter.ONGOING) {
      return this.itemRepository.find({
        where: [{ endDate: MoreThan(new Date()) }, { endDate: IsNull() }],
      });
    }

    return await this.itemRepository.find();
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
    this.eventEmitter.emit(EVENT.BID.CREATED, {
      itemId: id,
    });

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
    });

    if (!itemDB || itemDB.type !== TypeEnum.PUBLISHED) {
      throw new InternalServerErrorException('Item is not public');
    }

    if (itemDB.endDate < new Date()) {
      throw new InternalServerErrorException('Item is expired');
    }

    if (itemDB.currentPrice >= amount || amount < itemDB.startPrice) {
      throw new InternalServerErrorException('Current price must be higher than current price');
    }

    this.eventEmitter.emit(EVENT.BID.CREATED, {
      itemId: id,
      userId: user.id,
      amount,
    });

    return this.itemRepository.update(id, {
      currentPrice: amount,
      owner: user,
    });
  }
}
