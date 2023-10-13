import { UserProfile } from './user';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
};

export type EditableUserProfile = Partial<Omit<UserProfile, 'id'>>;
