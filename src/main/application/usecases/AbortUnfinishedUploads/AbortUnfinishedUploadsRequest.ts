import User from '../../../domain/entities/User';
import Request from '../../../infrastructure/Request';

type AbortUnfinishedUploadsRequest = Request & {
  user: User;
};

export default AbortUnfinishedUploadsRequest;
