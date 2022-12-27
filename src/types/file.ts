import { Document, Types } from 'mongoose';
import { ErrorResponseDTO } from './common';

export interface IFile extends Document {
  name: string;
  owner: Types.ObjectId;
  fileSize: number;
  uploaded: boolean;
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

export type InitiateUploadRequestDTO = {
  fileName: string;
  fileSize: number;
};

export type InitiateUploadResponseDTO =
  | {
      UploadId: string;
      urls: string[];
      fileId: string[];
      partSize: number;
    }
  | ErrorResponseDTO;

export type FinishUploadRequestDTO = { etags: string[]; fileId: string; UploadId: string };

export type FinishUploadResponseDTO = {} | ErrorResponseDTO;

export type DownloadFileResponseDTO = { url: string };
