import { LoginUserUseCase } from "../../usecase/login-user-use-case";
import { RegisterUserUseCase } from "../../usecase/register-user-use-case";
import { JwtService } from "../../../infrastructure/core/jwt-service";
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

export class UserAuthController implements IAuthController {
  private loginUseCase: ILoginUserCase;
  private registerUseCase: IRegisterUserCase;

  constructor(jwtService: JwtService) {
    const userRepo = new UserRepository();
    this.loginUseCase = new LoginUserUseCase(jwtService, userRepo);
    this.registerUseCase = new RegisterUserUseCase(userRepo);
  }
  async login(data: THttpRequest, res: THttpResponse): Promise<THttpResponse> {
    try {
      const result = await this.loginUseCase.login(data);
      return successLoginResponse(res, result);
    } catch (err: any) {
      if (err instanceof InputValidationException) {
        return errorResponse(res, err.message, 400);
      } else if (err instanceof AuthPreconditionException) {
        return errorResponse(res, err.message, 401);
      }
      return errorResponse(res, err.message);
    }
  }
  async register(
    data: THttpRequest,
    res: THttpResponse
  ): Promise<THttpResponse> {
    try {
      const result = await this.registerUseCase.register(data);
      return successResponse(res, result);
    } catch (err: any) {
      if (err instanceof InputValidationException) {
        return errorResponse(res, err.message, 400);
      } else if (err instanceof AuthPreconditionException) {
        return errorResponse(res, err.message, 401);
      }
      return errorResponse(res, err.message);
    }
  }
}
