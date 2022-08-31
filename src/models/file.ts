import { Schema, model } from 'mongoose';

import { IFile } from '../types/file';

const FileSchema = new Schema<IFile>({
  _id: Schema.Types.ObjectId,
  name: String,
  owner: Schema.Types.ObjectId,
  fileSize: Number,
  createdAt: Number,
  modifiedAt: Number,
  deletedAt: Number,
});

export default model<IFile>('File', FileSchema);
