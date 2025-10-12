export interface ILogger {
    info(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    error(message: string, error?: any, metadata?: Record<string, any>): void;
  }