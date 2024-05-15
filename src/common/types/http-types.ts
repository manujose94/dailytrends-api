
import { Request } from 'express';
export interface THttpRequest extends Request{
    user: string;
}

export interface THttpResponse {
    headers?: any;
    statusCode: number;
    body: THttpResponseBody;
}

export interface THttpResponseBody {
    success: boolean;
    result?: any;
    message?: string;
}