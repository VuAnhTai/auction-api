import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { config } from 'dotenv';
import { BidGuard } from './guard/bid.guard';
import { AuthModule } from '../auth/auth.module';
import { ItemSubscriber } from './items.listener';
config();

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService, BidGuard, ItemSubscriber],
  exports: [BidGuard],
})
export class ItemsModule {}
