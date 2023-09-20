import Request from '../../../infrastructure/Request';

type GetFolderFilesRequest = Request & {
  folderId: string;
};

export default GetFolderFilesRequest;
