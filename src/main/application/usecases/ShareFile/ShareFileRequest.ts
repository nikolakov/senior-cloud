import Request from '../../../infrastructure/Request';

type ShareFileRequest = Request & {
  fileId: string;
};

export default ShareFileRequest;
