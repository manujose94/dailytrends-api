import winston from 'winston';

const getLogger = (env: string) : winston.Logger => {
    const logger = winston.createLogger({
        level: env,
        format: winston.format.combine(
            winston.format.timestamp(),
            env === 'production' ? winston.format.uncolorize() : winston.format.colorize(),
            winston.format.splat(),
            winston.format.printf(({ level, message }) => `[${level}] ${message}`),
            
        ),
        transports: [
            new winston.transports.Console()
        ],
    });

    return logger;
};

export default getLogger;
