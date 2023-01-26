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
