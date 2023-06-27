import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { History } from '../histories/history.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, History])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
