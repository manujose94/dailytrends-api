import mongoose, { ConnectOptions } from 'mongoose';
import { Config } from '../config/config';
import getLogger from '../config/logger';
import { backoff } from '../utils/backoff';

const logger = getLogger(Config.getLogLevel());

export class Database {
    async connect(retries: number = 5): Promise<void> {
        const mongoUrl = Config.getMongoDBConnectionString();
        const options: ConnectOptions = {};

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                logger.info(`Connecting to the database (attempt ${attempt + 1})`);
                await mongoose.connect(mongoUrl, options);
                logger.info('Database connected');
                return;
            } catch (error) {
                if (attempt < retries) {
                    logger.warn(`Database connection warning (attempt ${attempt + 1})`);
                    await backoff(attempt + 1);  // Using the backoff utility for delay
                } else {
                    logger.error('Database connection error:',error);
                    throw new Error('Failed to connect to the database after multiple attempts');
                }
            }
        }
    }
}

