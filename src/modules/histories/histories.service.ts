import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';
import { Item } from '../items/item.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT } from '@/common/constants';
@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private eventEmitter: EventEmitter2
  ) {}

  async create(history: History): Promise<History> {
    return this.historyRepository.save(history);
  }

  async handleBidCompleted(item: Item): Promise<any> {
    const historiesLatestForEachUserInItem = await this.historyRepository
      .createQueryBuilder('history')
      .select('MAX(history.id)', 'id')
      .addSelect('history.userId', 'userId')
      .addSelect('history.itemId', 'itemId')
      .where('history.itemId = :itemId', { itemId: item.id })
      .andWhere('history.userId != :userId', { userId: item.owner.id })
      .groupBy('history.userId, history.itemId')
      .getRawMany();

    historiesLatestForEachUserInItem.forEach(history => {
      if (history.userId === item.owner.id) {
        return;
      }

      this.eventEmitter.emit(EVENT.USER.RESTORE_AMOUNT, {
        userId: history.userId,
        amount: history.amount,
        item,
      });
    });
  }
}
