import { createClient } from 'redis';
import { backoff } from '../utils/backoff';
import getLogger from '../config/logger';
import { Config } from '../config/config';

const logger = getLogger(Config.getLogLevel());

const redisConnectionString = Config.getRedisConnectionString();

const redisClient = createClient({
  url: redisConnectionString
});

let isRedisConnected = false;
let attempt = 0;
const maxAttempts = 10;

async function connectWithBackoff() {
  while (!isRedisConnected && attempt < maxAttempts) {
    try {
      attempt++;
      logger.info(`Connecting to Redis (attempt ${attempt})`);
      await redisClient.connect();
      logger.info('Redis connected');
      isRedisConnected = true;
    } catch (err) {
      logger.warn(`Redis connection failed (attempt ${attempt})`);
      isRedisConnected = false;
      if (attempt >= maxAttempts) {
        logger.error('Max reconnection attempts reached. Giving up.');
        break;
      }
      await backoff(attempt);
    }
  }
}


connectWithBackoff();

export { redisClient, isRedisConnected };