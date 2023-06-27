import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { AuthModule } from '../auth/auth.module';
import { BidGuard } from '../items/guard/bid.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([History])],
  controllers: [HistoriesController],
  providers: [BidGuard, HistoriesService],
})
export class HistoriesModule {}
