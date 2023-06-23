import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { BidGuard } from './guard/bid.guard';
import { AuthModule } from '../auth/auth.module';
import { ItemSubscriber } from './items.listener';
import { CacheService } from '@/providers/redis/redis.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService, BidGuard, ItemSubscriber, CacheService],
  exports: [BidGuard],
})
export class ItemsModule {}
