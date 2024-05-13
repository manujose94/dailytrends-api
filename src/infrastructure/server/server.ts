import express from 'express';
import { requestLoggerMiddleware } from '../middleware/request-logger-middleware';
import routes from '../routes';
import { errorHandler, successHandler } from '../middleware/morgan-middleware';
import { Database } from '../core/database';



export const startServer = async (port: number | string) => {
  const app = express();
  const database = new Database();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  app.use('/api/v1', routes);

  // Error handling middleware for unauthorized requests
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });


  // Error handling middleware for forbidden requests

  await new Promise((resolve) => 
    app.listen(port, async () => {
          
    await database.connect();

    resolve(app)
  }));

}
