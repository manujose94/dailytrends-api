import IUserRepository from "../../domain/port/user-repository-interface";
import { IJwtService } from "../ports/security/jwt-service-interface";
import { UnauthorizedException } from "../../domain/auth/exception/auth-unauthorized-exception"
import { NotFoundException } from "../../domain/auth/exception/not-found-exception";
import { IDeleteUserCase } from "../../domain/auth/usecase/delete-user-case-interface";

export class DeleteUserUseCase implements IDeleteUserCase {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly jwtService: IJwtService
    ) {}
  
    async deleteUserByToken(token: string): Promise<string> {
      const payload = this.jwtService.verify(token);
      const userId = payload?.id;
  
      if (!userId) {
        throw new UnauthorizedException("Invalid token");
      }
  
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
  
      const deleted = await this.userRepository.delete(userId);
      if (!deleted) {
        throw new Error("User deletion failed");
      }
  
      return "User successfully deleted";
    }
  }
