import Request from '../../../infrastructure/Request';
import UseCase from '../../../infrastructure/UseCase';
import ShareFileRequest from './ShareFileRequest';

class ShareFileUseCase implements UseCase {
  execute(request: Request) {
    const sfReq = request as ShareFileRequest;

    const { fileId } = sfReq;
  }
}

export default ShareFileUseCase;
