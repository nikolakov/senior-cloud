import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import GetRootFolderRequest from './GetRootFolderRequest';
import FolderGateway from '../../../infrastructure/gateways/FolderGateway/FolderGateway';

class GetRootFolderUseCase implements UseCase {
  private folderGateway: FolderGateway;

  constructor(folderGateway: FolderGateway) {
    this.folderGateway = folderGateway;
  }

  async execute(request: Request) {
    const grfReq = <GetRootFolderRequest>request;

    const folder = await this.folderGateway.findRootByOwner(grfReq.ownerId);

    if (!folder) throw new Error('folder_not_found');

    return folder.toBoundaryDTO();
  }
}

export default GetRootFolderUseCase;
