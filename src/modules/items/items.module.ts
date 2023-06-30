import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { BidGuard } from './guard/bid.guard';
import { AuthModule } from '../auth/auth.module';
import { ItemSubscriber } from './items.listener';
import { CacheService } from '@/providers/redis/redis.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { History } from '../histories/history.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Item, User, History])],
  controllers: [ItemsController],
  providers: [ItemsService, BidGuard, ItemSubscriber, CacheService, UsersService],
})
export class ItemsModule {}
