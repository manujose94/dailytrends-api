import { UserEntity } from "../../domain/auth/entities/user-entity";
import IUserRepository from "../../domain/auth/port/user-repository-interface";
import { USER_MODEL } from "../../domain/auth/models/user-model";

export default class UserRepository implements IUserRepository {
    private userModel = USER_MODEL
   
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userModel.findOne({ email });
    }
    async create(user: UserEntity): Promise<void> {
        const newUser = new this.userModel(user)
        await newUser.save();
    }
    async update(query: any, data: Partial<UserEntity>): Promise<UserEntity | null> {
        return await this.userModel.findOneAndUpdate(query, data)
    }
}