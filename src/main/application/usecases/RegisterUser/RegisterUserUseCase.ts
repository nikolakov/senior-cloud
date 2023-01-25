import User, { Role, UserBoundaryDTO } from '../../../domain/entities/User';
import UserGateway from '../../../infrastructure/gateways/UserGateway/UserGateway';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import RegisterUserRequest from './RegisterUserRequest';

class RegisterUserUseCase implements UseCase {
  private userGateway: UserGateway;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  async execute(request: Request): Promise<UserBoundaryDTO> {
    const ruReq = <RegisterUserRequest>request;

    const userWithSameUsername = await this.userGateway.findByUsername(ruReq.username);
    if (userWithSameUsername) throw new Error('username_exists');

    const userWithTheSameEmail = await this.userGateway.findByEmail(ruReq.email);
    if (userWithTheSameEmail) throw new Error('email_exists');

    const user = await this.createUserFromRegistrationData(ruReq);

    const newlyCreatedUser = await this.userGateway.create(user);

    return newlyCreatedUser.toBoundaryDTO();
  }

  private async createUserFromRegistrationData(ruReq: RegisterUserRequest): Promise<User> {
    const user = new User();
    user.username = ruReq.username;
    user.email = ruReq.email;

    await user.generatePasswordHash(ruReq.password);

    return user;
  }
}

export default RegisterUserUseCase;
