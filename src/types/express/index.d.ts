import DomainUser from '../../main/domain/entities/User';

declare global {
  namespace Express {
    interface User extends DomainUser {}
  }
}
