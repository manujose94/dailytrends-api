import { Request, Response } from "express";
export interface THttpRequest extends Request {
  user: string;
}

interface JsonResponse {
  success: boolean;
  result?: any;
  message?: string;
}

export interface THttpResponse extends Response {
  json: (body: JsonResponse) => this;
}
