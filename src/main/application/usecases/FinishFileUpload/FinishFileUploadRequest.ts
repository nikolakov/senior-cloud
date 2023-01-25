import Request from '../../../infrastructure/Request';

// this is specific to the S3 implementation, breaking the abstraction
// of the request and the usecase.
type FinishFileUploadRequest = Request & {
  fileId: string;
  etags: string[];
  uploadId: string;
};

export default FinishFileUploadRequest;
