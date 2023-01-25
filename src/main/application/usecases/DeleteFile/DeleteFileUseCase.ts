import File from '../../../domain/entities/File';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import DeleteFileRequest from './DeleteFileRequest';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';

class DeleteFileUseCase implements UseCase {
  private fileStorage: FileStorage;
  private fileGateway: FileGateway;

  constructor(fileStorage: FileStorage, fileGateway: FileGateway) {
    this.fileStorage = fileStorage;
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const dReq = <DeleteFileRequest>request;

    await this.fileGateway.delete(dReq.fileId);

    try {
      await this.fileStorage.deleteFile(dReq.fileId);
    } catch (e) {}
  }
}

export default DeleteFileUseCase;
