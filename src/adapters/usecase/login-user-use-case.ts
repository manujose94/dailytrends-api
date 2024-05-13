import IUserRepository from '../../domain/auth/port/user-repository-interface';
import { Encryptor } from '../services/encryptor-service';

import { THttpRequest } from '../../common/types/http-types';
import { validateUserData } from "../validation/validators";
import { JwtService } from '../../infrastructure/core/jwt-service';
import { ILoginUserCase } from 'src/domain/auth/usecase/login-user-case-interface';


export class LoginUserUseCase implements ILoginUserCase {
private readonly jwtService: JwtService;  
  private userRepository: IUserRepository;
  private encryptor: Encryptor;

  constructor(jwtService: JwtService, userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtService = jwtService || JwtService.getInstance();
    this.encryptor = new Encryptor();
  }
  
  
    async login({ body }: THttpRequest): Promise<string> {
      const userData = validateUserData(body);
      const user = await this.userRepository.findByEmail(userData.email);
      if (user) {
        const isPasswordValid = await this.encryptor.compare(userData.password, user.password);
        if (isPasswordValid) {
          return this.jwtService.sign(user);
        }
      }
      throw new Error('User not found');
    }
}