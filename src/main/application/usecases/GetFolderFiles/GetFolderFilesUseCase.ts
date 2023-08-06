import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import GetFolderFilesRequest from './GetFolderFilesRequest';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';

class GetFolderFilesUseCase implements UseCase {
  private fileGateway: FileGateway;

  constructor(fileGateway: FileGateway) {
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const gffReq = <GetFolderFilesRequest>request;

    const files = await this.fileGateway.findAllInFolder(gffReq.folderId);

    return files.map(file => file.toBoundaryDTO());
  }
}

export default GetFolderFilesUseCase;
