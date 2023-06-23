import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  name: process.env.REDIS_NAME,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
}));
