import { AxiosError } from 'axios';

export enum Role {
  Manager = 'manager',
  User = 'user',
}

export type LoginResponse = {
  token: string;
  expiresIn: string;
  user: UserProfile;
  // refreshToken: string;
};

export type UserProfile = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: Role;
};

export type EditableUserProfile = Partial<Omit<UserProfile, '_id'>>;

// type guards

export function isAxiosError<T = any>(error: AxiosError | any): error is AxiosError<T> {
  return error && error.isAxiosError;
}
