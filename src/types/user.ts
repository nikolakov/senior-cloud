import { Document } from 'mongoose';

export enum Role {
  Administrator = 'administrator',
  User = 'user',
}

export interface User {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hash: string;
  salt: string;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
  role: Role;
}

export interface IUser extends Document, User {}

export type UpdateUserRequestDTO = Omit<
  User,
  'hash' | 'salt' | 'createdAt' | 'modifiedAt' | 'deletedAt' | 'role'
>;
