import { FolderFromApi } from './folder';

export type UserId = string;

export enum Role {
  Manager = 'manager',
  User = 'user',
}

export type UserProfile = {
  id: UserId;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: Role;
  managedBy?: UserId;
  rootFolder: FolderFromApi;
};
