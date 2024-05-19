import { THttpRequest, THttpResponse } from "../../../common/types/http-types";

export interface IAuthController {
  login(data: THttpRequest, res: THttpResponse): Promise<THttpResponse>;
  register(data: THttpRequest, res: THttpResponse): Promise<THttpResponse>;
}
