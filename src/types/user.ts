export enum Role {
  Manager = 'manager',
  User = 'user',
}

export interface User {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hash: string;
  salt: string;
}

export type UpdateUserRequestDTO = Omit<
  User,
  'hash' | 'salt' | 'createdAt' | 'modifiedAt' | 'deletedAt' | 'role' | 'administratorLevel'
>;
