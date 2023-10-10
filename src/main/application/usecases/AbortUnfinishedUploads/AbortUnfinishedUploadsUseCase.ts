import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import AbortUnfinishedUploadsRequest from './AbortUnfinishedUploadsRequest';
import FileStorage from '../../../infrastructure/FileStorage/FileStorage';
import User, { Role } from '../../../domain/entities/User';

class AbortUnfinishedUploadsUseCase implements UseCase {
  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  async execute(request: Request) {
    const auuReq = <AbortUnfinishedUploadsRequest>request;

    if (!this.hasPermission(auuReq.user)) throw new Error('unauthorized');

    if (this.fileStorage.abortUnfinishedUploads) {
      const res = await this.fileStorage.abortUnfinishedUploads();
      return res;
    }
  }

  private hasPermission(user: User) {
    return user.role === Role.Manager;
  }
}

export default AbortUnfinishedUploadsUseCase;
