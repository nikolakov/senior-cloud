import { UserProfile } from './user';

export type LoginResponse = {
  token: string;
  expiresIn: string;
  user: UserProfile;
  // refreshToken: string;
};

export type EditableUserProfile = Partial<Omit<UserProfile, '_id'>>;
