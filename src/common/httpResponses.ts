import { THttpResponse } from "./types/http-types";


export function successResponse<T>(data: T, code: number = 200): THttpResponse {
    return {
        body: { result: data, success: true },
        statusCode: code === 200 ? 201 : code,
    };
}

export function successLoginResponse<T>(data: T, code: number = 200): THttpResponse {
    return {
        body: { result: {token: data}, success: true },
        statusCode: code === 200 ? 201 : code,
    };
}


export function errorResponse(message: string, code: number = 400): THttpResponse {
    return {
        body: { success: false, message },
        statusCode: code,
    };
}