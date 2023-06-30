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
      .addSelect('history.amount', 'amount')
      .where(subQuery => {
        const subQueryAlias = subQuery
          .subQuery()
          .select('MAX(subHistory.id)')
          .from('history', 'subHistory')
          .where('subHistory.userId = history.userId')
          .andWhere('subHistory.itemId = history.itemId')
          .groupBy('subHistory.userId, subHistory.itemId')
          .getQuery();

        return `history.id IN ${subQueryAlias}`;
      })
      .andWhere('history.itemId = :itemId', { itemId: item.id })
      .groupBy('history.userId, history.itemId, history.amount')
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

    this.eventEmitter.emit(EVENT.USER.RESTORE_AMOUNT, {
      userId: item.createdBy,
      amount: item.currentPrice,
      item,
    });

    console.log(historiesLatestForEachUserInItem);
  }
}
