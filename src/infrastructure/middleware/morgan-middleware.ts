import morgan from 'morgan';


import { Config } from '../config/config';
import getLogger from '../config/logger';


const getIpFormat = () => (Config.getEnv() === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const logger = getLogger(Config.getLogLevel());

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) },
});

export { successHandler, errorHandler };