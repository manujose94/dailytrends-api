import mongoose from 'mongoose';
import { Server } from 'http';
import getLogger from '../config/logger';
import { Config } from '../config/config';

const logger = getLogger(Config.getLogLevel());
export const gracefulShutdown = async (server: Server | null) => {
  logger.info("Graceful shutdown initiated");

  // Close the HTTP server if it's running
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info("HTTP server closed");
        resolve();
      });
    });
  }

  // Close the database connection if it's established
  if (mongoose.connection.readyState === 1) { // 1 means connected
    await mongoose.connection.close(false);
    logger.info("Database connection closed");
  }
  logger.info("Graceful shutdown finished");
  process.exit(0);
};
