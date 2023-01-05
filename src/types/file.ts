import { Document, Types } from 'mongoose';

export interface IFile extends Document<Types.ObjectId> {
  name: string;
  owner: Types.ObjectId;
  fileSize: number;
  uploaded: boolean;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
}
