import Request from '../../../infrastructure/Request';

type GetUserFilesRequest = Request & {
  ownerId: string;
};

export default GetUserFilesRequest;
