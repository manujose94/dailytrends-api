import { ICacheService } from '../../application/ports/services/cache-service-interface';
import { isRedisConnected, redisClient } from './redis-cache-client';

export class RedisCacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    if (!isRedisConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (err) {
      return null;
    }
  }

  async set(key: string, value: string, options?: { EX: number }): Promise<void> {
    if (!isRedisConnected) return;
    try {
      await redisClient.set(key, value, options);
    } catch (err) {
      return;
    }
  }
}