import Request from '../../../infrastructure/Request';

type DeleteFileRequest = Request & {
  fileId: string;
  userId: string;
};

export default DeleteFileRequest;
