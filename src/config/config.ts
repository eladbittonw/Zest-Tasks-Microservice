import * as dotenv from 'dotenv';
// config the env vars
dotenv.config();

type RedisConfigType = {
  host: string;
  port: number;
};

export const redisConfig: RedisConfigType = {
  host: String(process.env.REDIS_HOST) || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
};
