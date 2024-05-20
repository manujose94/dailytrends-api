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
    if (!user) return null;
    return user.toObject();
  }

  async create(item: UserEntity): Promise<string | null> {
    const newUser = new this.userModel(item);
    return (await newUser.save())._id.toString();
  }
  async update(query: any, data: Partial<UserEntity>): Promise<boolean | null> {
    return await this.userModel.findOneAndUpdate(query, data, { new: true });
  }
}
