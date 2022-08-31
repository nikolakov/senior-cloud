import { AxiosError } from 'axios';

export type LoginResponse = {
  token: string;
  expiresIn: string;
  user: UserProfile;
  // refreshToken: string;
};

export type UserProfile = {
  _id: string;
  username: string;
};

export type EditableUserProfile = Omit<UserProfile, '_id'>;

// type guards

export function isAxiosError<T = any>(error: AxiosError | any): error is AxiosError<T> {
  return error && error.isAxiosError;
}
