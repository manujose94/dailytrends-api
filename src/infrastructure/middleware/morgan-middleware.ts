import morgan from 'morgan';
import getLogger from '../config/logger';

const logger = getLogger('http');

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res) || ''), 
      contentLength: tokens.res(req, res, 'content-length'),
      responseTime: Number.parseFloat(tokens['response-time'](req, res) || ''),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);

export { morganMiddleware };