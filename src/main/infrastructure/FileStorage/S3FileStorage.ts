import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  AbortMultipartUploadCommand,
  ListMultipartUploadsCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';

import FileStorage, {
  InitiateUploadInput,
  FinishUploadInput,
  CreateDownloadUrlInput,
} from './FileStorage';

class S3FileStorage implements FileStorage {
  static PART_SIZE = 5 * 1024 * 1024;

  private s3Client: S3;

  constructor() {
    if (
      !process.env.S3_KEY ||
      !process.env.S3_SECRET ||
      !process.env.S3_ENDPOINT ||
      !process.env.S3_REGION
    ) {
      throw new Error('missing configuration variables');
    }

    this.s3Client = new S3({
      forcePathStyle: false,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
      },
    });

    this.assertSpacesConnection();
  }

  async initiateUpload(fileInfo: InitiateUploadInput) {
    const res = await new S3FileUploadInitiator(this.s3Client, fileInfo).initiateUpload();

    return {
      ...res,
      partSize: S3FileStorage.PART_SIZE,
    };
  }

  async finishUpload(fileInfo: FinishUploadInput) {
    return await new S3FileUploadFinisher(this.s3Client, fileInfo).finishUpload();
  }

  async createDownloadUrl(fileInfo: CreateDownloadUrlInput) {
    return await new S3FileDownloader(this.s3Client, fileInfo).createDownloadUrl();
  }

  async deleteFile(fileId: string) {
    return await new S3FileDeleter(this.s3Client, fileId).deleteFile();
  }

  async abortUnfinishedUploads() {
    return await new S3UploadsAborter(this.s3Client).abortUnfinishedUploads();
  }

  private async assertSpacesConnection() {
    try {
      await this.s3Client.send(new ListBucketsCommand({}));
      console.log('[S3FileStorage]', 'Connected to S3 Buckets');
    } catch (e) {
      console.error(e);
      throw new Error('Connection to FileStorage Failed');
    }
  }
}

class S3FileUploadInitiator {
  private s3Client: S3;
  private fileId: string;
  private fileSize: number;

  constructor(s3Client: S3, fileInfo: InitiateUploadInput) {
    this.s3Client = s3Client;
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

    const data = await this.s3Client.send(command);

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

      const promise = getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 });

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
  private s3Client: S3;
  private fileId: string;
  private uploadId: string;
  private etags: string[];

  constructor(s3Client: S3, fileInfo: FinishUploadInput) {
    this.s3Client = s3Client;
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

    const res = await this.s3Client.send(command);

    return res;
  };
}

class S3FileDownloader {
  private s3Client: S3;
  private fileId: string;
  private fileName: string;

  constructor(s3Client: S3, fileInfo: CreateDownloadUrlInput) {
    this.s3Client = s3Client;
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

    const res = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });

    return res;
  };
}

class S3FileDeleter {
  private s3Client: S3;
  private fileId: string;

  constructor(s3Client: S3, fileId: string) {
    this.s3Client = s3Client;
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

    const res = await this.s3Client.send(command);

    return res;
  };
}

class S3UploadsAborter {
  private s3Client: S3;

  constructor(s3Client: S3) {
    this.s3Client = s3Client;
  }

  async abortUnfinishedUploads() {
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

    const res = await this.s3Client.send(command);

    return res;
  };

  private abortMultipartUpload = async (fileName: string, UploadId: string) => {
    const command = new AbortMultipartUploadCommand({
      Bucket: 'senior-cloud-dev',
      Key: fileName,
      UploadId,
    });

    const res = await this.s3Client.send(command);

    return res;
  };
}

export default S3FileStorage;
