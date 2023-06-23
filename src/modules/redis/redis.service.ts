import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async onModuleInit() {
    await this.redis.ping((err, result) => {
      console.log('connect redis success');
    });
  }
  async set(key: string, value: string, expire?: number) {
    if (expire) {
      return await this.redis.setex(key, expire, value);
    } else {
      return await this.redis.set(key, value);
    }
  }
  async get(key: string) {
    return await this.redis.get(key);
  }
  async del(key: string) {
    return await this.redis.del(key);
  }
  async exists(key: string) {
    return await this.redis.exists(key);
  }
}
