import { Schema, model } from 'mongoose';

import { IFile } from '../types/file';

const FileSchema = new Schema<IFile>({
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

export default model<IFile>('File', FileSchema);
