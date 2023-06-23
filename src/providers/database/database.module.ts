import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sslConfig = configService.get<string>('database.certificate');
        const root = path.resolve(__dirname, '..', '..');
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          timezone: 'UTC',
          entities: [root + '/modules/*/*.entity{.ts,.js}'],
          synchronize: true,
          ssl: sslConfig
            ? {
                ca: Buffer.from(
                  configService.get<string>('database.certificate'),
                  'base64'
                ).toString('ascii'),
              }
            : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
