import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  name: 'auction',
  host: 'localhost',
  port: 6379,
  password: '',
}));
