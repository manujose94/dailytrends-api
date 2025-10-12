import IUserRepository from "../../domain/port/user-repository-interface";
import { Encryptor } from "../services/encryptor-service";
import { THttpRequest } from "../../common/types/http-types";
import { validateUserData } from "../validation/validators";
import { IRegisterUserCase } from "../../domain/auth/usecase/register-user-case-interface";
import { AuthPreconditionException } from "../../domain/auth/exception/auth-precondition-exception";

export class RegisterUserUseCase implements IRegisterUserCase {
  private userRepository: IUserRepository;
  private encryptor: Encryptor;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.encryptor = new Encryptor();
  }
  async register(data: THttpRequest): Promise<string> {
    
      const userData = validateUserData(data.body);
  
      const user = await this.userRepository.findByEmail(userData.email);
  
      if (user) {
        throw new AuthPreconditionException("Email already in use");
      }
  
      userData.password = await this.encryptor.hash(userData.password);
  
      await this.userRepository.create({
        ...userData,
      });
  
      return "Registration successful";
    }
  
 
}
