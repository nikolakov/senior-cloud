import Request from '../../../infrastructure/Request';

type GetRootFolderRequest = Request & {
  ownerId: string;
};

export default GetRootFolderRequest;
