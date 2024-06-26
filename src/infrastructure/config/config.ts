import dotenv from "dotenv";

dotenv.config();
export class Config {
  static getSecretKey(): string {
    return process.env.JWT_SECRET_KEY || "default_secret_key";
  }
  static getMongoDBConnectionString(): string {
    return (
      process.env.MONGODB_CONNECTION_STRING ||
      "mongodb://localhost:27018/mydatabase"
    );
  }

  static getRedisConnectionString(): string {
    const redisUrl = process.env.REDIS_URL || 'localhost';
    const redisPort = process.env.REDIS_PORT || '6379';
    return `redis://${redisUrl}:${redisPort}`;
  }

  static getLogLevel(): string {
    switch (process.env.NODE_ENV) {
      case "test":
      case "development":
        return "debug";
      case "production":
        return "warn";
      default:
        return "info";
    }
  }
  static getEnv(): string {
    return process.env.NODE_ENV || "development";
  }
  static getPort(): number {
    return parseInt(process.env.PORT || "3000");
  }

  static getRateLimitWindowMs(): number {
    return parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes in milliseconds
  }

  static getRateLimit(): number {
    return parseInt(process.env.RATE_LIMIT || "100"); // Default limit to 100 requests
  }
}
