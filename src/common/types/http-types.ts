import { Request, Response } from "express";
export interface THttpRequest extends Request {
  user: object;
}

interface JsonResponse {
  success: boolean;
  result?: string | number | boolean | object;
  message?: string;
}

export interface THttpResponse extends Response {
  json: (body: JsonResponse) => this;
}
