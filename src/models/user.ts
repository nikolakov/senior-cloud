import { Schema, model } from 'mongoose';

import { IUser, Role } from '../types/user';

const UserSchema = new Schema<IUser>({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  hash: String,
  salt: String,
  createdAt: Number,
  modifiedAt: Number,
  deletedAt: Number,
  role: {
    type: String,
    default: Role.User,
    enum: Object.values(Role),
  },
});

export default model<IUser>('User', UserSchema);
