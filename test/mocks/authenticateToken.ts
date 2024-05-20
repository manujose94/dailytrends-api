import { Request, Response, NextFunction } from "express";

export const mockAuthenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (req as any).user = { id: "test-user" };
  next();
};
