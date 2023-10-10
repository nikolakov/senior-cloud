import User, { UserBoundaryDTO } from '../../../domain/entities/User';
import UserGateway from '../../../infrastructure/gateways/UserGateway/UserGateway';
import UseCase from '../../../infrastructure/UseCase';
import Request from '../../../infrastructure/Request';
import UpdateUserRequest from './UpdateUserRequest';

class UpdateUserUseCase implements UseCase {
  private userGateway: UserGateway;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  async execute(request: Request): Promise<UserBoundaryDTO> {
    const uuReq = <UpdateUserRequest>request;

    const user = await this.userGateway.findById(uuReq.id);
    if (!user) throw new Error('user_not_found');

    this.updateUserWithNewData(user, uuReq);

    await this.checkForUsernameAndEmailConflicts(user);

    const updated = await this.userGateway.update(user);
    return updated.toBoundaryDTO();
  }

  // This is an anti-pattern, because it mutates the passed object
  private updateUserWithNewData(user: User, uuReq: UpdateUserRequest): void {
    user.username = uuReq.username;
    user.email = uuReq.email;
    user.firstName = uuReq.firstName;
    user.lastName = uuReq.lastName;
  }

  private async checkForUsernameAndEmailConflicts(user: User) {
    const usernameConflict = await this.userGateway.findConflict(
      user.id,
      'username',
      user.username
    );
    if (usernameConflict) throw new Error('username_exists');

    const emailConflict = await this.userGateway.findConflict(user.id, 'email', user.email);
    if (emailConflict) throw new Error('email_exists');
  }
}

export default UpdateUserUseCase;
