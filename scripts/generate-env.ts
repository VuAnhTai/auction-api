import { randomBytes } from 'crypto';
import * as fs from 'fs/promises';

const envMap = {
  //App
  NODE_ENV: 'development',
  PORT: '4000',
  PORT_SOCKET: '4001',
  //Database
  DB_TYPE: 'postgres',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'password123',
  DB_DATABASE: 'auction',
  POSTGRES_SSL_CERT: '',
  //JWT
  JWT_EXPIRY_TIME: '30d',
  //Cache
  REDIS_HOST: 'localhost',
  REDIS_NAME: 'auction',
  REDIS_PORT: '6379',
  REDIS_PASSWORD: '',
  REDIS_DB: '0',
};

const main = async () => {
  // Secret Key
  envMap['SECRET_KEY'] = randomBytes(20).toString('hex');
  envMap['JWT_SECRET'] = randomBytes(40).toString('hex');

  console.log(envMap);
  const envFile = Object.entries(envMap)
    .reduce((acc, [key, value]) => {
      acc.push(`${key}=${value}`);

      return acc;
    }, [] as string[])
    .join('\n');

  await fs.writeFile('.env', envFile);
};

main();
