import File from '../../../domain/entities/File';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import FinishFileUploadRequest from './FinishFileUploadRequest';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';

class FinishFileUploadUseCase implements UseCase {
  private fileStorage: FileStorage;
  private fileGateway: FileGateway;

  constructor(fileStorage: FileStorage, fileGateway: FileGateway) {
    this.fileStorage = fileStorage;
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const fuReq = <FinishFileUploadRequest>request;

    const file = await this.fileGateway.findById(fuReq.fileId);
    if (!file) throw new Error('file_not_found');

    await this.fileStorage.finishUpload(fuReq);

    file.uploaded = true;
    await this.fileGateway.update(file);
  }
}

export default FinishFileUploadUseCase;
