import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([History])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
