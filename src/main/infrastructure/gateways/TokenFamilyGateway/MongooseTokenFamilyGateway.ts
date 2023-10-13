import { Schema, model, Document, Types } from 'mongoose';

import TokenFamily, { TokenFamilyGatewayDTO } from '../../../domain/entities/TokenFamily';
import TokenFamilyGateway from './TokenFamilyGateway';

type MongooseTokenFamily = {
  userId: Types.ObjectId;
  index: number;
  invalidated: boolean;
  createdAt: Date;
  updatedAt: Date;
  gatewayDTO: TokenFamilyGatewayDTO;
};

const TokenFamilySchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    index: Number,
    invalidated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TokenFamilySchema.virtual('gatewayDTO').get(function (): TokenFamilyGatewayDTO {
  return {
    id: this.id,
    userId: (this.userId as Types.ObjectId).toString(),
    index: this.index as number,
    invalidated: this.invalidated as boolean,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

export const TokenFamilyModel = model<MongooseTokenFamily>('TokenFamily', TokenFamilySchema);

class MongooseTokenFamilyGateway implements TokenFamilyGateway {
  async create(tokenFamily: TokenFamily): Promise<TokenFamily> {
    const dto = tokenFamily.toGatewayDTO();
    const created = await new TokenFamilyModel(dto).save();
    return this.convertFromMongooseDocToEntity(created);
  }

  async findById(id: string): Promise<TokenFamily | undefined> {
    const doc = await TokenFamilyModel.findById(id);
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async update(folder: TokenFamily): Promise<TokenFamily> {
    const dto = folder.toGatewayDTO();
    const doc = await TokenFamilyModel.findOneAndUpdate({ _id: folder.id }, dto, {
      new: true,
    });

    if (!doc) throw new Error('folder_not_found');

    return this.convertFromMongooseDocToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const doc = await TokenFamilyModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
    return doc ? true : false;
  }

  private convertFromMongooseDocToEntity(
    document: Document<unknown, any, MongooseTokenFamily> &
      MongooseTokenFamily & { _id: Types.ObjectId }
  ): TokenFamily {
    const entity = new TokenFamily();
    entity.fromGatewayDTO(document.gatewayDTO);
    return entity;
  }
}

export default MongooseTokenFamilyGateway;
