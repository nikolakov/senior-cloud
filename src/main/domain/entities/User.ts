import crypto from 'crypto';

export enum Role {
  Manager = 'manager',
  User = 'user',
}

export type UserBoundaryDTO = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};

export type UserGatewayDTO = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  hash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};

type UserToGatewayDTO = Omit<UserGatewayDTO, 'id'>;

class User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  protected hash: string;
  protected salt: string;
  createdAt: Date;
  updatedAt: Date;
  protected _role: Role;

  constructor() {
    this.id = '';
    this.username = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.hash = '';
    this.salt = this.generateSalt();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this._role = Role.User;
  }

  get role() {
    return this._role;
  }

  async generatePasswordHash(password: string): Promise<void> {
    this.hash = await new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(password, this.salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          const genHash = derivedKey.toString('hex');
          resolve(genHash);
        }
      });
    });
  }

  async comparePassword(password: string): Promise<Boolean> {
    return new Promise<boolean>((resolve, reject) => {
      crypto.pbkdf2(password, this.salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          const hashVerify = derivedKey.toString('hex');
          resolve(this.hash === hashVerify);
        }
      });
    });
  }

  toBoundaryDTO(): UserBoundaryDTO {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: this._role,
    };
  }

  fromGatewayDTO(dto: UserGatewayDTO): void {
    this.id = dto.id;
    this.username = dto.username;
    this.email = dto.email;
    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.hash = dto.hash;
    this.salt = dto.salt;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this._role = dto.role;
  }

  toGatewayDTO(): UserToGatewayDTO {
    return {
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      hash: this.hash,
      salt: this.salt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: this.role,
    };
  }

  private generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export default User;
