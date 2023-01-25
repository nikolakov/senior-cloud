import { Schema, model, Document, Types } from 'mongoose';

import File, { FileGatewayDTO } from '../../../domain/entities/File';
import FileGateway from './FileGateway';

type MongooseFile = {
  name: string;
  owner: Types.ObjectId;
  fileSize: number;
  uploaded: boolean;
  createdAt: number;
  modifiedAt: number;
  deletedAt: number;
  gatewayDTO: FileGatewayDTO;
};

const FileSchema = new Schema({
  name: String,
  owner: Schema.Types.ObjectId,
  fileSize: Number,
  uploaded: {
    type: Boolean,
    default: false,
  },
  createdAt: Number,
  modifiedAt: Number,
  deletedAt: Number,
});

FileSchema.virtual('gatewayDTO').get(function (): FileGatewayDTO {
  return {
    id: this.id,
    name: this.name as string,
    owner: (this.owner as Types.ObjectId).toString(),
    fileSize: this.fileSize as number,
    uploaded: this.uploaded as boolean,
    createdAt: this.createdAt as number,
    modifiedAt: this.modifiedAt as number,
  };
});

const FileModel = model<MongooseFile>('File', FileSchema);

class MongooseFileGateway implements FileGateway {
  async create(file: File): Promise<File> {
    const dto = file.toGatewayDTO();

    const created = await new FileModel({
      name: dto.name,
      owner: dto.owner,
      fileSize: dto.fileSize,
      uploaded: dto.uploaded,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    }).save();

    return this.convertFromMongooseDocToFile(created);
  }

  async findById(id: string): Promise<File | undefined> {
    const doc = await FileModel.findOne({ _id: id, deletedAt: undefined });

    return doc ? this.convertFromMongooseDocToFile(doc) : undefined;
  }

  async update(file: File): Promise<File> {
    const updatedFileDTO = { ...file.toGatewayDTO(), modifiedAt: Date.now() };
    console.log(updatedFileDTO);
    const fileDoc = await FileModel.findOneAndUpdate({ _id: file.id }, updatedFileDTO, {
      new: true,
    });

    if (!fileDoc) throw new Error('file_not_found');
    return this.convertFromMongooseDocToFile(fileDoc);
  }

  async delete(id: string): Promise<boolean> {
    const fileDoc = await FileModel.findOneAndUpdate(
      { _id: id, deletedAt: undefined },
      { deletedAt: Date.now() }
    );

    return fileDoc ? true : false;
  }

  async findAllByOwner(ownerId: string): Promise<File[]> {
    const fileDocs = await FileModel.find({ owner: ownerId, uploaded: true, deletedAt: undefined });
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
