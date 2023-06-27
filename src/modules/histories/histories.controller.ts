import { EVENT } from '@/common/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { HistoriesService } from './histories.service';
import { History } from './history.entity';
import { Item } from '../items/item.entity';
import { Controller } from '@nestjs/common';

@Controller('histoies')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @OnEvent(EVENT.HISTORY.CREATED)
  handleHistoryCreated(payload: History) {
    this.historiesService.create(payload);
  }

  @OnEvent(EVENT.BID.COMPLETED)
  handleBidCompleted(payload: Item) {
    this.historiesService.handleBidCompleted(payload);
  }
}
