import Request from '../../../infrastructure/Request';

type LoginUserRequest = Request & {
  username: string;
  password: string;
};

export default LoginUserRequest;
