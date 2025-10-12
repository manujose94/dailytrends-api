import IUserRepository from "../../domain/port/user-repository-interface";
import { Encryptor } from "../services/encryptor-service";

import { THttpRequest } from "../../common/types/http-types";
import { validateUserData } from "../validation/validators";
import { ILoginUserCase } from "../../domain/auth/usecase/login-user-case-interface";
import { AuthPreconditionException } from "../../domain/auth/exception/auth-precondition-exception";
import { IJwtService } from "../ports/security/jwt-service-interface";

export class LoginUserUseCase implements ILoginUserCase {
  private readonly jwtService: IJwtService;
  private userRepository: IUserRepository;
  private encryptor: Encryptor;

  constructor(jwtService: IJwtService, userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.encryptor = new Encryptor();
  }

  async login({ body }: THttpRequest): Promise<string> {
    const userData = validateUserData(body);
    try {
      const user = await this.userRepository.findByEmail(userData.email);
      if (user) {
        const isPasswordValid = await this.encryptor.compare(
          userData.password,
          user.password
        );
        if (isPasswordValid) {
          return this.jwtService.sign(userData);
        }
      }
      throw new AuthPreconditionException("User not found");
    } catch (error) {
      throw new Error("Operation login failed");
    }
  }
}
