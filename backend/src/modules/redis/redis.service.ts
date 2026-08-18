import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      const redisUrl = this.configService.get<string>('redis.url');
      const host = this.configService.get<string>('redis.host', 'localhost');
      const port = this.configService.get<number>('redis.port', 6379);
      const password = this.configService.get<string>('redis.password');

      if (redisUrl) {
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 2,
          retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 2000)),
        });
      } else {
        this.client = new Redis({
          host,
          port,
          password: password || undefined,
          maxRetriesPerRequest: 2,
          retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 2000)),
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Đã kết nối thành công tới Redis Cache server');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Tiếp tục chạy mà không có cache.`);
      });
    } catch (error) {
      this.logger.warn(`Không thể khởi tạo Redis client: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Lỗi đọc cache key ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, stringValue, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      this.logger.error(`Lỗi ghi cache key ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Lỗi xóa cache key ${key}: ${error.message}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Lỗi xóa cache pattern ${pattern}: ${error.message}`);
    }
  }

  getClient(): Redis | null {
    return this.client;
  }
}
