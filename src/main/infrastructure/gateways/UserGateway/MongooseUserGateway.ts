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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  role: Role;
  gatewayDTO: UserGatewayDTO;
};

const UserSchema = new Schema(
  {
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    hash: String,
    salt: String,
    deletedAt: Date,
    role: {
      type: String,
      enum: Object.values(Role),
    },
  },
  { timestamps: true }
);

UserSchema.virtual('gatewayDTO').get(function (): UserGatewayDTO {
  return {
    id: this.id,
    username: this.username as string,
    email: this.email as string,
    firstName: this.firstName as string,
    lastName: this.lastName as string,
    hash: this.hash as string,
    salt: this.salt as string,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    role: this.role as Role,
  };
});

UserSchema.pre('find', function () {
  this.where({ deletedAt: undefined });
});

UserSchema.pre('findOne', function () {
  this.where({ deletedAt: undefined });
});

const UserModel = model<MongooseUser>('User', UserSchema);

class MongooseUserGateway implements UserGateway {
  async create(user: User): Promise<User> {
    const dto = user.toGatewayDTO();
    const created = await new UserModel(dto).save();
    return this.convertFromMongooseDocToEntity(created);
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find();
    return docs.map(doc => this.convertFromMongooseDocToEntity(doc));
  }

  async findById(id: string): Promise<User | undefined> {
    const doc = await UserModel.findById(id);
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async update(user: User): Promise<User> {
    const dto = user.toGatewayDTO();
    const doc = await UserModel.findOneAndUpdate({ _id: user.id }, dto, {
      new: true,
    });

    if (!doc) throw new Error('user_not_found');
    return this.convertFromMongooseDocToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const doc = await UserModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
    return doc ? true : false;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ email });
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ username });
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async findConflict(id: string, field: string, value: string): Promise<Boolean> {
    const conflictDoc = await UserModel.findOne({
      _id: { $ne: id },
      [field]: value,
    });

    return !!conflictDoc;
  }

  private convertFromMongooseDocToEntity(
    document: Document<unknown, any, MongooseUser> & MongooseUser & { _id: Types.ObjectId }
  ): User {
    const entity = new User();
    entity.fromGatewayDTO(document.gatewayDTO);
    return entity;
  }
}

export default MongooseUserGateway;
