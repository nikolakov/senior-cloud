import Request from '../../../infrastructure/Request';

type DeleteFileRequest = Request & {
  fileId: string;
};

export default DeleteFileRequest;
