import { Logger } from "winston";
import getLogger from "../config/logger";
import { Config } from "../config/config";
import { ILogger } from "../../adapters/ports/logger/logger-interface";


export class LoggerAdapter implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = getLogger(Config.getLogLevel());
  }

  info(message: string, metadata: Record<string, any> = {}): void {
    this.logger.info(message, metadata);
  }

  warn(message: string, metadata: Record<string, any> = {}): void {
    this.logger.warn(message, metadata);
  }

  error(message: string, error: any = null, metadata: Record<string, any> = {}): void {
    if (error) {
      this.logger.error(message, { error, ...metadata });
    } else {
      this.logger.error(message, metadata);
    }
  }
}