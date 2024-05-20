import { Schema, model } from "mongoose";

export interface IUserModel {
  email: string;
  password: string;
}
const userSchema = new Schema<IUserModel>(
  {
    email: { type: String, unique: true, required: true, select: false },
    password: { type: String, required: true, select: false }
  },
  {
    versionKey: false,
    collection: "USER"
  }
);
export const USER_MODEL = model<IUserModel>("USER", userSchema);
