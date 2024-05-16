import { UserEntity } from "../auth/entities/user-entity";
import { IRepository } from "./repository-interface";

export default interface IUserRepository extends IRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  update(query: any, data: Partial<UserEntity>): Promise<boolean | null>;
}
