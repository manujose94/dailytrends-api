import { THttpResponse } from "./types/http-types";
import { Response } from "express";
export function successResponse<T>(
  res: Response,
  data: T,
  code: number = 200
): Response {
  return res.status(code).json({
    success: true,
    result: data
  });
}

// Successfully respond for login-specific scenario
export function successLoginResponse<T>(
  res: Response, // Use THttpResponse correctly to ensure type safety
  data: T,
  code: number = 200
): THttpResponse {
  return res.status(code).json({
    success: true,
    result: data
  }) as THttpResponse; // Cast it back to THttpResponse
}

// Error response handling
export function errorResponse(
  res: Response, // Correctly take a Response object as argument
  message: string,
  code: number = 500
): Response {
  return res.status(code).json({
    success: false,
    message
  });
}
