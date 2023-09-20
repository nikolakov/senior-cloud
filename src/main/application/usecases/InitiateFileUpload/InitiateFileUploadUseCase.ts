import File from '../../../domain/entities/File';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import InitiateUploadRequest from './InitiateUploadRequest';
import FileGateway from '../../../infrastructure/gateways/FileGateway/FileGateway';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';

class InitiateFileUploadUseCase implements UseCase {
  private fileStorage: FileStorage;
  private fileGateway: FileGateway;

  constructor(fileStorage: FileStorage, fileGateway: FileGateway) {
    this.fileStorage = fileStorage;
    this.fileGateway = fileGateway;
  }

  async execute(request: Request) {
    const iuReq = <InitiateUploadRequest>request;

    const file = this.createFileFromUploadInitiationData(iuReq);
    const savedFile = await this.storeFileInDB(file);
    const { partSize, uploadId, urls } = await this.initiateUploadInStorage(savedFile);

    return { partSize, uploadId, urls, fileId: savedFile.id };
  }

  private createFileFromUploadInitiationData(iuReq: InitiateUploadRequest) {
    const file = new File();

    file.name = iuReq.fileName;
    file.fileSize = iuReq.fileSize;
    file.owner = iuReq.owner;
    file.folder = iuReq.folderId;

    return file;
  }

  private storeFileInDB(file: File) {
    return this.fileGateway.create(file);
  }

  private initiateUploadInStorage(file: File) {
    return this.fileStorage.initiateUpload({
      fileId: file.id,
      fileSize: file.fileSize,
    });
  }
}

export default InitiateFileUploadUseCase;
