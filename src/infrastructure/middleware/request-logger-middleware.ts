import { Request, Response, NextFunction } from 'express';

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = new Date().getTime();
  res.on('finish', () => {
    const endTime = new Date().getTime();
    console.log(
      `${req.method} ${req.path} ${res.statusCode} - ${endTime - startTime}ms`
    );
  });
  next();
};