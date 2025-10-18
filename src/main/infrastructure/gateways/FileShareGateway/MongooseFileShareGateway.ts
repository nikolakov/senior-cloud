import { Schema, model, Document, Types } from 'mongoose';

import FileShare, { FileShareGatewayDTO } from '../../../domain/entities/FileShare';
import FileShareGateway from './FileShareGateway';

type MongooseFile = {
  name: string;
  fileId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  gatewayDTO: FileShareGatewayDTO;
};

const FileShareSchema = new Schema(
  {
    name: String,
    fileId: Schema.Types.ObjectId,
    deletedAt: Date,
  },
  { timestamps: true }
);

FileShareSchema.virtual('gatewayDTO').get(function (): FileShareGatewayDTO {
  return {
    id: this.id,
    fileId: (this.fileId as Types.ObjectId).toString(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

FileShareSchema.pre('find', function () {
  this.where({ deletedAt: undefined });
});

FileShareSchema.pre('findOne', function () {
  this.where({ deletedAt: undefined });
});

export const FileShareModel = model<MongooseFile>('FileShare', FileShareSchema);

class MongooseFileShareGateway implements FileShareGateway {
  async create(fileShare: FileShare): Promise<FileShare> {
    const created = await new FileShareModel(fileShare.toGatewayDTO()).save();

    return this.convertFromMongooseDocToEntity(created);
  }

  async findById(id: string): Promise<FileShare | undefined> {
    const doc = await FileShareModel.findById(id);

    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async update(fileShare: FileShare): Promise<FileShare> {
    const doc = await FileShareModel.findOneAndUpdate(
      { _id: fileShare.id },
      fileShare.toGatewayDTO(),
      {
        new: true,
      }
    );

    if (!doc) throw new Error('file_not_found');
    return this.convertFromMongooseDocToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const doc = await FileShareModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });

    return doc ? true : false;
  }

  private convertFromMongooseDocToEntity(
    document: Document<unknown, any, MongooseFile> & MongooseFile & { _id: Types.ObjectId }
  ): FileShare {
    const entity = new FileShare();
    entity.fromGatewayDTO(document.gatewayDTO);
    return entity;
  }
}

export default MongooseFileShareGateway;
