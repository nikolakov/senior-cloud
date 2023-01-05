import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  AbortMultipartUploadCommand,
  ListMultipartUploadsCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { s3Client } from '../s3Client';
import FileStorage, {
  InitiateUploadInput,
  FinishUploadInput,
  CreateDownloadUrlInput,
} from './FileStorage';

class S3FileStorage implements FileStorage {
  static PART_SIZE = 5 * 1024 * 1024;

  async initiateUpload(fileInfo: InitiateUploadInput) {
    const res = await new S3FileUploadInitiator(fileInfo).initiateUpload();

    return {
      ...res,
      partSize: S3FileStorage.PART_SIZE,
    };
  }

  async finishUpload(fileInfo: FinishUploadInput) {
    return await new S3FileUploadFinisher(fileInfo).finishUpload();
  }

  async createDownloadUrl(fileInfo: CreateDownloadUrlInput) {
    return await new S3FileDownloader(fileInfo).createDownloadUrl();
  }

  async deleteFile(fileId: string) {
    return await new S3FileDeleter(fileId).deleteFile();
  }

  async abortAllUploads() {
    return await new S3UploadsAborter().abortAllUploads();
  }
}

class S3FileUploadInitiator {
  private fileId: string;
  private fileSize: number;

  constructor(fileInfo: InitiateUploadInput) {
    this.fileId = fileInfo.fileId;
    this.fileSize = fileInfo.fileSize;
  }

  async initiateUpload() {
    try {
      const uploadId = await this.initiateMultipartUpload();
      if (!uploadId) throw new Error();

      const numberOfParts = this.getTotalNumberOfParts();
      const urls = await this.generatePresignedPartUrls(uploadId, numberOfParts);

      return { uploadId, urls };
    } catch (e) {
      console.log(e);
      // return res.status(503).send({ error: 's3_unavailable' });
      throw new Error('s3_unavailable');
    }
  }

  private initiateMultipartUpload = async () => {
    const command = new CreateMultipartUploadCommand({
      // think of a way to have the same bucket names in prod & dev
      // or store bucket names in env variables too
      Bucket: 'senior-cloud-dev',
      Key: this.fileId,
    });

    const data = await s3Client.send(command);

    return data.UploadId;
  };

  private generatePresignedPartUrls = async (UploadId: string, parts: number) => {
    const promises = [];

    for (let i = 0; i < parts; i++) {
      const command = new UploadPartCommand({
        Bucket: 'senior-cloud-dev',
        Key: this.fileId,
        PartNumber: i + 1,
        UploadId,
      });

      const promise = getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });

      promises.push(promise);
    }

    const urls = await Promise.all(promises);

    return urls;
  };

  private getTotalNumberOfParts() {
    return Math.ceil(this.fileSize / S3FileStorage.PART_SIZE);
  }
}

class S3FileUploadFinisher {
  private fileId: string;
  private uploadId: string;
  private etags: string[];

  constructor(fileInfo: FinishUploadInput) {
    this.fileId = fileInfo.fileId;
    this.uploadId = fileInfo.uploadId;
    this.etags = fileInfo.etags;
  }

  async finishUpload() {
    await this.completeMultipartUpload();
  }

  private completeMultipartUpload = async () => {
    const Parts = this.etags.map((etag, index) => ({
      ETag: etag,
      PartNumber: index + 1,
    }));

    const command = new CompleteMultipartUploadCommand({
      Bucket: 'senior-cloud-dev',
      Key: this.fileId,
      UploadId: this.uploadId,
      MultipartUpload: { Parts },
    });

    const res = await s3Client.send(command);

    return res;
  };
}

class S3FileDownloader {
  private fileId: string;
  private fileName: string;

  constructor(fileInfo: CreateDownloadUrlInput) {
    this.fileId = fileInfo.fileId;
    this.fileName = fileInfo.fileName;
  }

  async createDownloadUrl() {
    return await this.generateDownloadUrl();
  }

  private generateDownloadUrl = async () => {
    const command = new GetObjectCommand({
      Bucket: 'senior-cloud-dev',
      Key: this.fileId,
      ResponseContentDisposition: `filename="${this.fileName}"`,
    });

    const res = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return res;
  };
}

class S3FileDeleter {
  private fileId: string;

  constructor(fileId: string) {
    this.fileId = fileId;
  }

  async deleteFile() {
    await this.deleteFileFromStorage();
  }

  private deleteFileFromStorage = async () => {
    const command = new DeleteObjectCommand({
      Bucket: 'senior-cloud-dev',
      Key: this.fileId,
    });

    const res = await s3Client.send(command);

    return res;
  };
}

class S3UploadsAborter {
  async abortAllUploads() {
    const listUploadsResponse = await this.listMultipartUploads();

    const promises: Promise<any>[] = [];

    listUploadsResponse.Uploads?.forEach(upload => {
      if (upload.Key && upload.UploadId) {
        const promise = this.abortMultipartUpload(upload.Key, upload.UploadId);
        promises.push(promise);
      }
    });

    await Promise.all(promises);

    const listAfterDeleteResponse = await this.listMultipartUploads();

    return {
      deleted: promises.length,
      before: listUploadsResponse,
      after: listAfterDeleteResponse,
    };
  }

  private listMultipartUploads = async () => {
    const command = new ListMultipartUploadsCommand({
      Bucket: 'senior-cloud-dev',
    });

    const res = await s3Client.send(command);

    return res;
  };

  private abortMultipartUpload = async (fileName: string, UploadId: string) => {
    const command = new AbortMultipartUploadCommand({
      Bucket: 'senior-cloud-dev',
      Key: fileName,
      UploadId,
    });

    const res = await s3Client.send(command);

    return res;
  };
}

export default S3FileStorage;
