import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Item } from './item.entity';
import { KEY_CLS } from '@/common/constants';
import { ClsService } from 'nestjs-cls';
@EventSubscriber()
export class ItemSubscriber implements EntitySubscriberInterface<Item> {
  constructor(dataSource: DataSource, private readonly cls: ClsService) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return Item;
  }
  beforeInsert(event: InsertEvent<Item>) {
    const user = this.cls.get(KEY_CLS.USER);
    event.entity.createdBy = user.id;
    event.entity.owner = {
      id: user.id,
      email: user.email,
    };
  }

  beforeUpdate(event: UpdateEvent<Item>) {
    event.entity.updatedBy = this.cls.get(KEY_CLS.USER).sub;
  }
}
