import Request from '../../../infrastructure/Request';

type InitiateUploadRequest = Request & {
  fileName: string;
  fileSize: number;
  owner: string;
  folderId: string;
};

export default InitiateUploadRequest;
