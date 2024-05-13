import { THttpRequest } from "../../../common/types/http-types";

export interface ILoginUserCase {
    login(data: THttpRequest): Promise<string> ;
}