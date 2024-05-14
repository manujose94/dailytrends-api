import { Response, NextFunction, Request } from "express";
import { JwtService } from "../core/jwt-service";
import { THttpRequest } from "../../common/types/http-types";

const jwtService = new JwtService();

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = jwtService.verify(token);
    (req as THttpRequest).user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
