import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { Item } from './item.entity';
import { StatusEnum, TypeEnum, TypeFilter } from '../../common/enums';
import { CacheService } from '@/providers/redis/redis.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly cacheService: CacheService
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

    return this.itemRepository.update(id, {
      type: TypeEnum.PUBLISHED,
      startDate: new Date(),
      endDate: new Date(Date.now() + item.duration * 1000),
    });
  }

  async bid(id: number, { amount }: { amount: number }): Promise<any> {
    // using redis to check highest bid and update current price
    // prevent race condition
    const key = `item:${id}:highestBid`;
    await this.cacheService.watch(key);
    const highestBid = +(await this.cacheService.get(key));
    console.log(highestBid, amount);
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

    return this.itemRepository.update(id, {
      currentPrice: amount,
    });
  }
}