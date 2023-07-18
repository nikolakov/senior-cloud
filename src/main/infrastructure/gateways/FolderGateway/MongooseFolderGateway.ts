import { Schema, model, Document, Types, Mongoose } from 'mongoose';

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

    const created = await new FolderModel({
      name: dto.name,
      owner: dto.owner,
      parentFolder: dto.parentFolder,
    }).save();

    folder.fromGatewayDTO(created.gatewayDTO);

    return folder;
  }

  async findById(id: string): Promise<Folder | undefined> {
    const doc = await FolderModel.findById(id);
    return doc ? this.convertFromMongooseDocToFolder(doc) : undefined;
  }

  async update(folder: Folder): Promise<Folder> {
    const folderDoc = await FolderModel.findOneAndUpdate(
      { _id: folder.id },
      folder.toGatewayDTO(),
      {
        new: true,
      }
    );

    if (!folderDoc) throw new Error('folder_not_found');

    return this.convertFromMongooseDocToFolder(folderDoc);
  }

  async delete(id: string): Promise<boolean> {
    const folderDoc = await FolderModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });

    return folderDoc ? true : false;
  }

  async findRootByOwner(ownerId: string): Promise<Folder | undefined> {
    const folderDoc = await FolderModel.findOne({ owner: ownerId, parentFolder: undefined });

    return folderDoc ? this.convertFromMongooseDocToFolder(folderDoc) : undefined;
  }

  async findChildrenByParent(parentId: string): Promise<Folder[]> {
    const folderDocs = await FolderModel.find({ parentFolder: parentId });

    return folderDocs.map(folderDoc => this.convertFromMongooseDocToFolder(folderDoc));
  }

  private convertFromMongooseDocToFolder(
    document: Document<unknown, any, MongooseFolder> & MongooseFolder & { _id: Types.ObjectId }
  ): Folder {
    const folder = new Folder();
    folder.fromGatewayDTO(document.gatewayDTO);
    return folder;
  }
}

export default MongooseFolderGateway;
