import IUserRepository from '../../domain/auth/port/user-repository-interface';
import { Encryptor } from '../services/encryptor-service';
import { THttpRequest } from '../../common/types/http-types';
import { validateUserData } from '../validation/validators';
import { IRegisterUserCase } from 'src/domain/auth/usecase/register-user-case-interface';

export class RegisterUserUseCase implements IRegisterUserCase{
  private userRepository: IUserRepository;
  private encryptor: Encryptor;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.encryptor = new Encryptor();
  }

    async register({ body }: THttpRequest) {
        const userData = validateUserData(body);
    
        const user = await this.userRepository.findByEmail(userData.email);
    
        if (user) {
        throw new Error('User already exists');
        }
    
        userData.password = await this.encryptor.hash(userData.password);
    
        await this.userRepository.create({
            ...userData
        });
    
        return 'User created';
    }


}