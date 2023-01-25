import File from '../../../domain/entities/File';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import GetUserFilesRequest from './GetUserFilesRequest';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';

class GetUserFilesUseCase implements UseCase {
  private fileGateway: FileGateway;

  constructor(fileGateway: FileGateway) {
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const gufReq = <GetUserFilesRequest>request;

    const files = await this.fileGateway.findAllByOwner(gufReq.ownerId);

    return files.map(file => file.toBoundaryDTO());
  }
}

export default GetUserFilesUseCase;
