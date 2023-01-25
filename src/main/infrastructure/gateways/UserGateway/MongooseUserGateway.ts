import { Schema, model, Document, Types } from 'mongoose';

import UserGateway from './UserGateway';
import User, { Role, UserGatewayDTO } from '../../../domain/entities/User';

type MongooseUser = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  hash: string;
  salt: string;
  createdAt: number;
  modifiedAt: number;
  deletedAt: number;
  role: Role;
  gatewayDTO: UserGatewayDTO;
};

const UserSchema = new Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  hash: String,
  salt: String,
  createdAt: Number,
  modifiedAt: Number,
  deletedAt: Number,
  role: {
    type: String,
    default: Role.User,
    enum: Object.values(Role),
  },
});

UserSchema.virtual('gatewayDTO').get(function (): UserGatewayDTO {
  return {
    id: this.id,
    username: this.username as string,
    email: this.email as string,
    firstName: this.firstName as string,
    lastName: this.lastName as string,
    hash: this.hash as string,
    salt: this.salt as string,
    createdAt: this.createdAt as number,
    modifiedAt: this.modifiedAt as number,
    role: this.role,
  };
});

const UserModel = model<MongooseUser>('User', UserSchema);

class MongooseUserGateway implements UserGateway {
  async create(user: User): Promise<User> {
    const dto = user.toGatewayDTO();

    const created = await new UserModel({
      username: dto.username,
      email: dto.email,
      hash: dto.hash,
      salt: dto.salt,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      deletedAt: undefined,
    }).save();

    return this.convertFromMongooseDocToUser(created);
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find({ deletedAt: undefined });
    return userDocs.map(userDoc => this.convertFromMongooseDocToUser(userDoc));
  }

  async findById(id: string): Promise<User | undefined> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.convertFromMongooseDocToUser(userDoc) : undefined;
  }

  async update(user: User): Promise<User> {
    const updatedUserDTO = { ...user.toGatewayDTO(), modifiedAt: Date.now() };

    const userDoc = await UserModel.findOneAndUpdate({ _id: user.id }, updatedUserDTO, {
      new: true,
    });

    if (!userDoc) throw new Error('user_not_found');
    return this.convertFromMongooseDocToUser(userDoc);
  }

  async delete(id: string): Promise<boolean> {
    const userDoc = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: undefined },
      { deletedAt: Date.now() }
    );

    return userDoc ? true : false;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? this.convertFromMongooseDocToUser(userDoc) : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({ username });
    return userDoc ? this.convertFromMongooseDocToUser(userDoc) : undefined;
  }

  async findConflict(id: string, field: string, value: string): Promise<Boolean> {
    const conflictDoc = await UserModel.findOne({
      _id: { $ne: id },
      [field]: value,
    });

    return !!conflictDoc;
  }

  private convertFromMongooseDocToUser(
    document: Document<unknown, any, MongooseUser> & MongooseUser & { _id: Types.ObjectId }
  ): User {
    const user = new User();
    user.fromGatewayDTO(document.gatewayDTO);
    return user;
  }
}

export default MongooseUserGateway;
