import { LoginUserUseCase } from "../../usecase/login-user-use-case";
import { RegisterUserUseCase } from "../../usecase/register-user-use-case";
import { JwtService } from "../../../infrastructure/core/jwt-service";
import { errorResponse, successLoginResponse, successResponse } from "../../../common/httpResponses";
import { IAuthController } from "../../ports/controllers/auth-controller-interface"
import { ILoginUserCase } from "../../../domain/auth/usecase/login-user-case-interface"
import { THttpRequest, THttpResponse, THttpResponseBody } from "../../../common/types/http-types";
import UserRepository from "../../repositories/user-repository";
import { IRegisterUserCase } from "src/domain/auth/usecase/register-user-case-interface";

export class UserAuthController implements IAuthController {
    private loginUseCase: ILoginUserCase
    private registerUseCase: IRegisterUserCase;

     constructor(jwt: JwtService) {
        const userRepo = new UserRepository();
        this.loginUseCase = new LoginUserUseCase(jwt, userRepo);
        this.registerUseCase = new RegisterUserUseCase(userRepo);
    }
    async login(data: THttpRequest): Promise<THttpResponse> {
        try {
            const result= await this.loginUseCase.login(data);
            return successLoginResponse(result);
        } catch (error: any) {
            return errorResponse(error.message);
        }
    }
    async register(data: THttpRequest): Promise<THttpResponse> {
        try {
            const result= await this.registerUseCase.register(data);
            return successResponse({message: result});
        } catch (error: any) {
            return errorResponse(error.message);
        }
    }


  
} 