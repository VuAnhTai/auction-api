import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import appConfig from './app.config.mock';
import authConfig from './auth.config.mock';
import databaseConfig from './database.config.mock';
import cacheConfig from './cache.config.mock';

const validationSchema = Joi.object({
  // App
  PORT: Joi.number().default(4000),
  PORT_SOCKET: Joi.number().default(4001),
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  POSTGRES_SSL_CERT: Joi.string().allow(''),

  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY_TIME: Joi.string().required(),

  // Cache
  REDIS_HOST: Joi.string().required(),
  REDIS_NAME: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow(''),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, authConfig, databaseConfig, cacheConfig],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
