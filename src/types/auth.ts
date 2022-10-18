import { IUser } from './user';
import { ErrorResponseDTO } from './common';

export type LoginRequestDTO = {
  username: string;
  password: string;
  recaptchaToken?: string;
};

export type RegisterRequestDTO = {
  username: string;
  email: string;
  password: string;
  recaptchaToken: string;
};

export type AuthResponseDTO =
  | {
      user: IUser;
      token: string;
      expiresIn: string;
    }
  | ErrorResponseDTO;
