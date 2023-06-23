import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { CacheService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class RedisCacheModule {
  public static getRedisOption(config: ConfigService): RedisModuleOptions {
    const redis = config.get('redis');
    if (!redis) {
      throw new Error('redis config is missing');
    }

    return redis;
  }

  public static forRoot(): DynamicModule {
    return {
      module: RedisCacheModule,
      imports: [
        RedisModule.forRootAsync(
          {
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
              return RedisCacheModule.getRedisOption(configService);
            },
            inject: [ConfigService],
          },
          true
        ),
      ],
      controllers: [],
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}
