import { Schema, model } from 'mongoose';

import { IUploadJob } from '../types/file';

const UploadJobSchema = new Schema<IUploadJob>({
  fileId: Schema.Types.ObjectId,
  name: String,
  owner: Schema.Types.ObjectId,
  fileSize: Number,
  totalChunks: Number,
  chunksCount: Number,
  createdAt: Number,
  modifiedAt: Number,
  deletedAt: Number,
});

export default model<IUploadJob>('UploadJob', UploadJobSchema);
