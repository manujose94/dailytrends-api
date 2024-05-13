import mongoose, { ConnectOptions } from 'mongoose';
import { Config } from '../config/config';
import getLogger from '../config/logger';

const logger = getLogger(Config.getLogLevel());
export class Database {


    async connect() {
        try {
            const mongoUrl = Config.getMongoDBConnectionString();
            const options: ConnectOptions = {
                
            };
            logger.info('Connecting to the database');
            await mongoose.connect(mongoUrl, options);
            logger.info('Database connected');
        } catch (error) {
            logger.error('Database connection error:', error);
            throw new Error('Failed to connect to the database');
        }
    }
}