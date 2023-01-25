import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import AbortUnfinishedUploadsRequest from './AbortUnfinishedUploadsRequest';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';

class AbortUnfinishedUploadsUseCase implements UseCase {
  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  async execute(request: Request) {
    const auuReq = <AbortUnfinishedUploadsRequest>request;

    if (this.fileStorage.abortUnfinishedUploads) {
      const res = await this.fileStorage.abortUnfinishedUploads();
      return res;
    }
  }
}

export default AbortUnfinishedUploadsUseCase;
