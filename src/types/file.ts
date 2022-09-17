import { Document, Types } from 'mongoose';
import { ErrorResponseDTO } from './common';

export interface IFile extends Document {
  name: string;
  owner: Types.ObjectId;
  fileSize: number;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
}

export interface IUploadJob extends Document {
  fileId: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  fileSize: number;
  totalChunks: number;
  chunksCount: number;
  createdAt: number;
  modifiedAt: number;
  deletedAt?: number;
}

export type CreateJobRequestDTO = {
  fileName: string;
  fileSize: number;
};

export type CreateJobResponseDTO = { jobId: string; chunkSize: number } | ErrorResponseDTO;

export type TempJWTResponseDTO =
  | {
      token: string;
    }
  | ErrorResponseDTO;
