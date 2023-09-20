import Request from '../../../infrastructure/Request';

type CreateFolderRequest = Request & {
  name: string;
  parentFolderId: string;
  owner: string;
};

export default CreateFolderRequest;
