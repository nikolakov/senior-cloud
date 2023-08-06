import UseCase from '../../../infrastructure/UseCase';
import Folder from '../../../domain/entities/Folder';
import FolderGateway from '../../../infrastructure/gateways/FolderGateway/FolderGateway';
import { FolderBoundaryDTO } from '../../../domain/entities/Folder';
import CreateFolderRequest from './CreateFolderRequest';

class CreateFolderUseCase implements UseCase {
  folderGateway: FolderGateway;

  constructor(folderGateway: FolderGateway) {
    this.folderGateway = folderGateway;
  }

  async execute(request: CreateFolderRequest): Promise<FolderBoundaryDTO> {
    const cfReq = <CreateFolderRequest>request;

    const folder = this.createFolderFromRequest(cfReq);
    const createdFolder = await this.folderGateway.create(folder);

    return createdFolder.toBoundaryDTO();
  }

  private createFolderFromRequest(request: CreateFolderRequest): Folder {
    const folder = new Folder();

    folder.name = request.name;
    folder.parentFolder = request.parentFolderId;
    folder.owner = request.owner;

    return folder;
  }
}

export default CreateFolderUseCase;
