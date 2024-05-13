import { THttpRequest, THttpResponse } from "../../../common/types/http-types";

export interface IAuthController {
    login(data: THttpRequest): Promise<THttpResponse>;
    register(data: THttpRequest): Promise<THttpResponse>;
}