import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}
  async root(): Promise<boolean> {
    const client = this.redisService.getClient();
    return client !== null;
  }

  async get(key: string): Promise<string> {
    const client = this.redisService.getClient();
    return await client.get(key);
  }

  async set(key: string, value: any): Promise<any> {
    const client = this.redisService.getClient();
    return await client.set(key, value);
  }

  async del(key: string): Promise<any> {
    const client = this.redisService.getClient();
    return await client.del(key);
  }

  async flushall(): Promise<any> {
    const client = this.redisService.getClient();
    return await client.flushall();
  }

  async keys(pattern: string): Promise<any> {
    const client = this.redisService.getClient();
    return await client.keys(pattern);
  }

  async exists(key: string): Promise<any> {
    const client = this.redisService.getClient();
    return await client.exists(key);
  }

  async expire(key: string, seconds: number): Promise<any> {
    const client = this.redisService.getClient();
    return await client.expire(key, seconds);
  }

  async ttl(key: string): Promise<any> {
    const client = this.redisService.getClient();
    return await client.ttl(key);
  }

  async setnx(key: string, value: any): Promise<any> {
    const client = this.redisService.getClient();
    return await client.setnx(key, value);
  }

  async setex(key: string, seconds: number, value: any): Promise<any> {
    const client = this.redisService.getClient();
    return await client.setex(key, seconds, value);
  }

  async getset(key: string, value: any): Promise<any> {
    const client = this.redisService.getClient();
    return await client.getset(key, value);
  }

  async mget(...keys: string[]): Promise<any> {
    const client = this.redisService.getClient();
    return await client.mget(...keys);
  }

  async mset(...keysValues: string[]): Promise<any> {
    const client = this.redisService.getClient();
    return await client.mset(...keysValues);
  }

  async watch(key: string): Promise<any> {
    const client = this.redisService.getClient();
    return await client.watch(key);
  }

  async unwatch(): Promise<any> {
    const client = this.redisService.getClient();
    return await client.unwatch();
  }

  async multi(): Promise<any> {
    const client = this.redisService.getClient();
    return client.multi();
  }
}
