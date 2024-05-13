import { Model, Schema, Document, model } from "mongoose"

export interface IUserModel extends Document {
    email: { type: string, unique: true, required: true, select: false },
    password: { type: string },
}
const userSchema = new Schema(
    {
        email: { type: String, unique: true, required: true, select: false },
        password: { type: String, required: true, select: false },
    },
    {
        versionKey: false,
        collection: 'USER'
    }
)
export const USER_MODEL: Model<IUserModel> = model<IUserModel>('USER', userSchema)