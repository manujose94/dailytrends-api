import { UserEntity } from "../../domain/auth/entities/user-entity";
import IUserRepository from "../../domain/port/user-repository-interface";
import { IUserModel, USER_MODEL } from "../../domain/auth/models/user-model";
import { BaseRepository } from "./base-repository";

export default class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  private userModel = USER_MODEL;

  constructor() {
    super(USER_MODEL);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel
      .findOne({ email })
      .select({ email: 1, password: 1, _id: 1 });
    if (!user) {
      throw new Error("User not found");
    }
    return user.toObject();
  }

  async create(item: UserEntity): Promise<void> {
    const newUser = new this.userModel(item);
    await newUser.save();
  }
  async update(query: any, data: Partial<UserEntity>): Promise<boolean | null> {
    return await this.userModel.findOneAndUpdate(query, data, { new: true });
  }
}
