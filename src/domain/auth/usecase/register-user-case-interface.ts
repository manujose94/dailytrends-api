import { THttpRequest } from "../../../common/types/http-types";

export interface IRegisterUserCase {
    register(data: THttpRequest): Promise<string>;
}