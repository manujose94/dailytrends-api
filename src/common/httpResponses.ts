import { THttpResponse } from "./types/http-types";


export function successResponse<T>(data: T, code: number = 200): THttpResponse {
    return {
        body: { result: data, statusCode: 200, success: true },
        statusCode: code === 200 ? 201 : code,
    };
}

export function errorResponse(message: string, code: number = 400): THttpResponse {
    return {
        body: { statusCode: code, success: false, message },
        statusCode: code,
    };
}