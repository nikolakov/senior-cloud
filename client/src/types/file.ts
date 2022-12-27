export type FileFromApi = {
  _id: string;
  name: string;
  owner: string;
  fileSize: number;
  uploaded: boolean;
  createdAt: number;
  modifiedAt: number;
};

export type InitiateUploadResponse = {
  urls: string[];
  partSize: number;
  UploadId: string;
  fileId: string;
};
