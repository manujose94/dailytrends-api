import { UserEntity } from "../entities/user-entity";

export default interface IUserRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    create(user: UserEntity): Promise<void>;
    update(query: any, data: Partial<UserEntity>): Promise<UserEntity | null>;
}