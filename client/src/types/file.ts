export type FileFromApi = {
  _id: string;
  name: string;
  owner: string;
  fileSize: number;
  createdAt: number;
  modifiedAt: number;
};

export type JobFromApi = {
  jobId: string;
  chunkSize: number;
};

export type JobFromApiv2 = {
  urls: string[];
  partSize: number;
  UploadId: string;
  fileId: string;
};
