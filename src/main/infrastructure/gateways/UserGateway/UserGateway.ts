import User from '../../../domain/entities/User';

interface UserGateway {
  create(user: User): Promise<User>;

  findAll(): Promise<User[]>;

  findById(id: string): Promise<User | undefined>;

  update(user: User): Promise<User>;

  delete(id: string): Promise<boolean>;

  findByEmail(email: string): Promise<User | undefined>;

  findByUsername(username: string): Promise<User | undefined>;

  findConflict(id: string, field: string, value: string): Promise<Boolean>;
}

export default UserGateway;
