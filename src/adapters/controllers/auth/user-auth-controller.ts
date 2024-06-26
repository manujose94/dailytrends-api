import { LoginUserUseCase } from "../../../application/usecases/login-user-use-case";
import { RegisterUserUseCase } from "../../../application/usecases/register-user-use-case";

import {
  errorResponse,
  successLoginResponse,
  successResponse
} from "../../../common/httpResponses";
import { IAuthController } from "../../ports/controllers/auth-controller-interface";
import { ILoginUserCase } from "../../../domain/auth/usecase/login-user-case-interface";
import { THttpRequest, THttpResponse } from "../../../common/types/http-types";
import UserRepository from "../../repositories/user-repository";
import { IRegisterUserCase } from "../../../domain/auth/usecase/register-user-case-interface";
import { InputValidationException } from "../../../common/exceptions/input-validation-exception";
import { AuthPreconditionException } from "../../../domain/auth/exception/auth-precondition-exception";
import { IJwtService } from "../../../application/ports/security/jwt-service-interface";


export class UserAuthController implements IAuthController {
  private loginUseCase: ILoginUserCase;
  private registerUseCase: IRegisterUserCase;

  constructor(jwtService: IJwtService) {
    const userRepo = new UserRepository();
    this.loginUseCase = new LoginUserUseCase(jwtService, userRepo);
    this.registerUseCase = new RegisterUserUseCase(userRepo);
  }
  async login(data: THttpRequest, res: THttpResponse): Promise<THttpResponse> {
    try {
      const result = await this.loginUseCase.login(data);
      return successLoginResponse(res, {token: result});
    } catch (err) {
      if (err instanceof InputValidationException) {
        return errorResponse(res, err.message, 400);
      } else if (err instanceof AuthPreconditionException) {
        return errorResponse(res, err.message, 401);
      }
      return errorResponse(res,"Error logging in");;
    }
  }
  async register(
    data: THttpRequest,
    res: THttpResponse
  ): Promise<THttpResponse> {
    try {
      const result = await this.registerUseCase.register(data);
      return successResponse(res, result);
    } catch (err) {
      if (err instanceof InputValidationException) {
        return errorResponse(res, err.message, 400);
      } else if (err instanceof AuthPreconditionException) {
        return errorResponse(res, err.message, 401);
      }
      return errorResponse(res, "Error registering");
    }
  }
}
