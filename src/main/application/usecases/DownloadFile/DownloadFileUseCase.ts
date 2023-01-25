import File from '../../../domain/entities/File';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import DownloadFileRequest from './DownloadFileRequest';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';

class DownloadFileUseCase implements UseCase {
  private fileStorage: FileStorage;
  private fileGateway: FileGateway;

  constructor(fileStorage: FileStorage, fileGateway: FileGateway) {
    this.fileStorage = fileStorage;
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const dReq = <DownloadFileRequest>request;

    const file = await this.fileGateway.findById(dReq.fileId);
    if (!file) throw new Error('file_not_found');

    return await this.fileStorage.createDownloadUrl({ fileId: file.id, fileName: file.name });
  }
}

export default DownloadFileUseCase;
