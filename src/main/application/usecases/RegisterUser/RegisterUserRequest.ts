import Request from '../../../infrastructure/Request';

type RegisterUserRequest = Request & {
  username: string;
  email: string;
  password: string;
};

export default RegisterUserRequest;
