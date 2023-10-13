import { Schema, model, Document, Types } from 'mongoose';

import Folder, { FolderGatewayDTO } from '../../../domain/entities/Folder';
import FolderGateway from './FolderGateway';

type MongooseFolder = {
  name: string;
  owner: Types.ObjectId;
  parentFolder?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  gatewayDTO: FolderGatewayDTO;
};

const FolderSchema = new Schema(
  {
    name: String,
    owner: Schema.Types.ObjectId,
    parentFolder: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

FolderSchema.virtual('gatewayDTO').get(function (): FolderGatewayDTO {
  return {
    id: this.id,
    name: this.name as string,
    owner: (this.owner as Types.ObjectId).toString(),
    parentFolder: this.parentFolder ? this.parentFolder.toString() : undefined,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

FolderSchema.pre('find', function () {
  this.where({ deletedAt: undefined });
});

FolderSchema.pre('findOne', function () {
  this.where({ deletedAt: undefined });
});

export const FolderModel = model<MongooseFolder>('Folder', FolderSchema);

class MongooseFolderGateway implements FolderGateway {
  async create(folder: Folder): Promise<Folder> {
    const dto = folder.toGatewayDTO();
    const created = await new FolderModel(dto).save();
    return this.convertFromMongooseDocToEntity(created);
  }

  async findById(id: string): Promise<Folder | undefined> {
    const doc = await FolderModel.findById(id);
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async update(folder: Folder): Promise<Folder> {
    const dto = folder.toGatewayDTO();
    const doc = await FolderModel.findOneAndUpdate({ _id: folder.id }, dto, {
      new: true,
    });

    if (!doc) throw new Error('folder_not_found');
    return this.convertFromMongooseDocToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const doc = await FolderModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
    return doc ? true : false;
  }

  async findRootByOwner(ownerId: string): Promise<Folder | undefined> {
    const doc = await FolderModel.findOne({ owner: ownerId, parentFolder: undefined });
    return doc ? this.convertFromMongooseDocToEntity(doc) : undefined;
  }

  async findChildrenByParent(parentId: string): Promise<Folder[]> {
    const docs = await FolderModel.find({ parentFolder: parentId });

    return docs.map(doc => this.convertFromMongooseDocToEntity(doc));
  }

  private convertFromMongooseDocToEntity(
    document: Document<unknown, any, MongooseFolder> & MongooseFolder & { _id: Types.ObjectId }
  ): Folder {
    const entity = new Folder();
    entity.fromGatewayDTO(document.gatewayDTO);
    return entity;
  }
}

export default MongooseFolderGateway;
