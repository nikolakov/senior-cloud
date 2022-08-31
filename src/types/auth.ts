import { Document } from 'mongoose';

export enum Role {
  Administrator = 'administrator',
  User = 'user',
}

export interface IUser extends Document {
  username: string;
  email: string;
  hash: string;
  salt: string;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
  role: Role;
}
