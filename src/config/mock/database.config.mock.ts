import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password123',
  database: 'auction',
  certificate: '',
}));
