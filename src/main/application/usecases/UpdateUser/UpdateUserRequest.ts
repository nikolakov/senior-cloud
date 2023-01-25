import Request from '../../../infrastructure/Request';

type UpdateUserRequest = Request & {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default UpdateUserRequest;
