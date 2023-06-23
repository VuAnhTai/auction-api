import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../providers/database/database.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@/config/config.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
import { ClsModule } from 'nestjs-cls';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from '../events/events.module';
import { AppController } from './app.controller';
import { ItemsModule } from '../items/items.module';
import { RedisCacheModule } from '../redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ItemsModule,
    ConfigModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    EventEmitterModule.forRoot(),
    EventsModule,
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
