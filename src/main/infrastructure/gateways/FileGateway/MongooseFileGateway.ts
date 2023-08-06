import { Schema, model, Document, Types } from 'mongoose';

import File, { FileGatewayDTO } from '../../../domain/entities/File';
import FileGateway from './FileGateway';

type MongooseFile = {
  name: string;
  owner: Types.ObjectId;
  folder: Types.ObjectId;
  fileSize: number;
  uploaded: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  gatewayDTO: FileGatewayDTO;
};

const FileSchema = new Schema(
  {
    name: String,
    owner: Schema.Types.ObjectId,
    folder: Schema.Types.ObjectId,
    fileSize: Number,
    uploaded: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

FileSchema.virtual('gatewayDTO').get(function (): FileGatewayDTO {
  return {
    id: this.id,
    name: this.name as string,
    owner: (this.owner as Types.ObjectId).toString(),
    folder: (this.folder as Types.ObjectId).toString(),
    fileSize: this.fileSize as number,
    uploaded: this.uploaded as boolean,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

FileSchema.pre('find', function () {
  this.where({ deletedAt: undefined });
});

FileSchema.pre('findOne', function () {
  this.where({ deletedAt: undefined });
});

export const FileModel = model<MongooseFile>('File', FileSchema);

class MongooseFileGateway implements FileGateway {
  async create(file: File): Promise<File> {
    const created = await new FileModel(file.toGatewayDTO()).save();

    return this.convertFromMongooseDocToFile(created);
  }

  async findById(id: string): Promise<File | undefined> {
    const doc = await FileModel.findById(id);

    return doc ? this.convertFromMongooseDocToFile(doc) : undefined;
  }

  async update(file: File): Promise<File> {
    const fileDoc = await FileModel.findOneAndUpdate({ _id: file.id }, file.toGatewayDTO(), {
      new: true,
    });

    if (!fileDoc) throw new Error('file_not_found');
    return this.convertFromMongooseDocToFile(fileDoc);
  }

  async delete(id: string): Promise<boolean> {
    const fileDoc = await FileModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });

    return fileDoc ? true : false;
  }

  async findAllByOwner(ownerId: string): Promise<File[]> {
    const fileDocs = await FileModel.find({ owner: ownerId, uploaded: true });
    return fileDocs.map(doc => this.convertFromMongooseDocToFile(doc));
  }

  async findAllInFolder(folderId: string): Promise<File[]> {
    const fileDocs = await FileModel.find({ folder: folderId, uploaded: true });
    return fileDocs.map(doc => this.convertFromMongooseDocToFile(doc));
  }

  private convertFromMongooseDocToFile(
    document: Document<unknown, any, MongooseFile> & MongooseFile & { _id: Types.ObjectId }
  ): File {
    const file = new File();
    file.fromGatewayDTO(document.gatewayDTO);
    return file;
  }
}

export default MongooseFileGateway;
