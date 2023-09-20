import { UserProfile } from './user';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: UserProfile;
};

export type EditableUserProfile = Partial<Omit<UserProfile, 'id'>>;
