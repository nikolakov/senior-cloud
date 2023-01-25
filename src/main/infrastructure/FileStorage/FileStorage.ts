export type InitiateUploadInput = {
  fileId: string;
  fileSize: number;
};

export type InitiateUploadOutput = {
  uploadId: string;
  urls: string[];
  partSize: number;
};

export type FinishUploadInput = {
  fileId: string;
  etags: string[];
  uploadId: string;
};

export type CreateDownloadUrlInput = {
  fileId: string;
  fileName: string;
};

interface FileStorage {
  initiateUpload(fileInfo: InitiateUploadInput): Promise<InitiateUploadOutput>;

  uploadPart?: (data: any) => Promise<void>;

  finishUpload(fileInfo: FinishUploadInput): Promise<void>;

  createDownloadUrl(fileInfo: CreateDownloadUrlInput): Promise<string>;

  deleteFile(fileId: string): Promise<void>;

  abortUnfinishedUploads?: () => Promise<any>;
}

export default FileStorage;
