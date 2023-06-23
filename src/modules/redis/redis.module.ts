import { Global, Module } from '@nestjs/common';
import { CacheService } from './redis.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            password: configService.get('redis.password'),
            db: configService.get('redis.db'),
          },
        }),
      },
      true
    ),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisCacheModule {}
