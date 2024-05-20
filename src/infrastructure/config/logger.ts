import { createLogger, transports, format, Logger } from 'winston';

const getLogger = (env: string): Logger => {
const logger =createLogger({
    level: env,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    if (metadata.constructor === Object && Object.keys(metadata).length > 0){
                        return `[${timestamp}]:[${level}]:${message}:${JSON.stringify(metadata)}`;
                    }
                    return `[${timestamp}]:[${level}]:${message}`;
                })
            ),
        }),
        new transports.File({
            dirname: 'logs',
            filename: 'winston_example.log',
            format: format.combine(format.json()),
        }),
    ],
    format: format.combine(format.metadata(), format.timestamp()),
});
return  logger;
}

export default getLogger;
