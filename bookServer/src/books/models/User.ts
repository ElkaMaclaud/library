import { Document, Schema, model } from "mongoose"

export interface IUser extends Document {
    username: string,
    displayName: string,
    emails: { value: string }[],
    password: string,
}

const UserModel = new Schema<IUser>({
    username: { type: String, required: true, default: "" },
    displayName: { type: String, default: "" },
    emails: { type: [{ value: { type: String } }], default: [] },
    password: { type: String, required: true },
})

export const User = model<IUser>("User", UserModel)