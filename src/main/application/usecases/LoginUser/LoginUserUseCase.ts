import { UserBoundaryDTO } from '../../../domain/entities/User';
import UserGateway from '../../../infrastructure/gateways/UserGateway/UserGateway';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import LoginUserRequest from './LoginUserRequest';

class LoginUserUseCase implements UseCase {
  private userGateway: UserGateway;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  async execute(request: Request): Promise<UserBoundaryDTO> {
    const luReq = <LoginUserRequest>request;

    const user = await this.userGateway.findByUsername(luReq.username);

    if (!user) throw new Error('user_not_found');

    const passwordIsCorrect = await user.comparePassword(luReq.password);

    if (!passwordIsCorrect) throw new Error('incorrect_password');

    return user.toBoundaryDTO();
  }
}

export default LoginUserUseCase;
