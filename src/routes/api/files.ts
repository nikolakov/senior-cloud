import { Router } from 'express';
import passport from 'passport';
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

import { s3Client } from '../../s3Client';
import File from '../../models/file';
import {
  InitiateUploadResponseDTO,
  InitiateUploadRequestDTO,
  FinishUploadRequestDTO,
  DownloadFileResponseDTO,
} from 'types/file';

const MAX_STORAGE = 1024 * 1024 * 1024;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const PART_SIZE = 5 * 1024 * 1024;

const router = Router();

const initiateMultipartUpload = async (fileName: string) => {
  const command = new CreateMultipartUploadCommand({
    // think of a way to have the same bucket names in prod & dev
    // or store bucket names in env variables too
    Bucket: 'senior-cloud-dev',
    Key: fileName,
  });

  const data = await s3Client.send(command);

  return data.UploadId;
};

const generatePresignedPartUrls = async (fileName: string, UploadId: string, parts: number) => {
  const promises = [];

  for (let i = 0; i < parts; i++) {
    const command = new UploadPartCommand({
      Bucket: 'senior-cloud-dev',
      Key: fileName,
      PartNumber: i + 1,
      UploadId,
    });

    const promise = getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });

    promises.push(promise);
  }

  const urls = await Promise.all(promises);

  return urls;
};

const abortMultipartUpload = async (fileName: string, UploadId: string) => {
  const command = new AbortMultipartUploadCommand({
    Bucket: 'senior-cloud-dev',
    Key: fileName,
    UploadId,
  });

  const res = await s3Client.send(command);

  return res;
};

const listMultipartUploads = async () => {
  const command = new ListMultipartUploadsCommand({
    Bucket: 'senior-cloud-dev',
  });

  const res = await s3Client.send(command);

  return res;
};

const completeMultipartUpload = async (etags: string[], UploadId: string, fileId: string) => {
  const Parts = etags.map((etag, index) => ({
    ETag: etag,
    PartNumber: index + 1,
  }));

  const command = new CompleteMultipartUploadCommand({
    Bucket: 'senior-cloud-dev',
    Key: fileId,
    UploadId: UploadId,
    MultipartUpload: { Parts },
  });

  const res = await s3Client.send(command);

  return res;
};

const generateDownloadUrl = async (fileId: string, fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: 'senior-cloud-dev',
    Key: fileId,
    ResponseContentDisposition: `filename="${fileName}"`,
  });

  const res = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return res;
};

const deleteFile = async (fileId: string) => {
  const command = new DeleteObjectCommand({
    Bucket: 'senior-cloud-dev',
    Key: fileId,
  });

  const res = await s3Client.send(command);

  return res;
};

router.post<{}, InitiateUploadResponseDTO, InitiateUploadRequestDTO>(
  '/initiateUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { fileSize, fileName } = req.body;

    const newFile = new File({
      name: fileName,
      owner: req.user?._id,
      fileSize,
    });

    const file = await newFile.save();

    const fileId = file._id.toString();

    const UploadId = await initiateMultipartUpload(fileId);

    if (!UploadId) {
      return res.status(503).send({ error: 's3_unavailable' });
    }

    const numberOfParts = Math.ceil(fileSize / PART_SIZE);

    const urls = await generatePresignedPartUrls(fileId, UploadId, numberOfParts);

    res.send({
      UploadId,
      urls,
      fileId,
      partSize: PART_SIZE,
    });
  }
);

router.post<{}, {}, FinishUploadRequestDTO>(
  '/finishUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { etags, fileId, UploadId } = req.body;

    const file = await File.findOne({ _id: fileId });

    if (!file) {
      return res.status(400).send({ error: 'file_not_found' });
    }

    await completeMultipartUpload(etags, UploadId, fileId);

    await file.updateOne({ uploaded: true, modifiedAt: Date.now() });

    res.status(204).end();
  }
);

// This is intended for dev purposes only
// Aborts all unfinished uploads
router.post(
  '/abortUploads',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const listUploadsResponse = await listMultipartUploads();

    const promises: Promise<any>[] = [];

    listUploadsResponse.Uploads?.forEach(upload => {
      if (upload.Key && upload.UploadId) {
        const promise = abortMultipartUpload(upload.Key, upload.UploadId);

        promises.push(promise);
      }
    });

    await Promise.all(promises);

    const listAfterDeleteResponse = await listMultipartUploads();

    res.send({
      deleted: promises.length,
      before: listUploadsResponse,
      after: listAfterDeleteResponse,
    });
  }
);

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const files = await File.find({ owner: req.user?._id, uploaded: true, deletedAt: undefined });

  res.send(files);
});

router.get<{ fileId: string }, DownloadFileResponseDTO>(
  '/:fileId/download',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, uploaded: true, deletedAt: undefined });

    if (!file) {
      return res.status(404).end();
    }

    const url = await generateDownloadUrl(fileId, file.name);

    return res.send({ url });
  }
);

router.delete<{ fileId: string }>(
  '/:fileId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, uploaded: true, deletedAt: undefined });

    if (!file) {
      return res.status(204).end();
    }

    await file.updateOne({ deletedAt: Date.now() });
    await deleteFile(fileId);

    return res.status(204).end();
  }
);

export default router;
