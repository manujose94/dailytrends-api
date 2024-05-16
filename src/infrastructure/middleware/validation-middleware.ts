import { Request, Response, NextFunction } from "express";

export function validateLimit(req: Request, res: Response, next: NextFunction) {
  const limitQueryParam = req.query.limit;
  if (!limitQueryParam) {
    return next();
  }
  const limit = parseInt(limitQueryParam as string, 10);
  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({
      error: "Invalid limit parameter on query. It must be a positive number."
    });
  }
  req.query.limit = limit.toString();
  next();
}
