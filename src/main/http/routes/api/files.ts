import { Router } from 'express';
import passport from 'passport';

import InitiateFileUploadUseCase from '../../../application/usecases/InitiateFileUpload/InitiateFileUploadUseCase';
import FinishFileUploadUseCase from '../../../application/usecases/FinishFileUpload/FinishFileUploadUseCase';
import AbortUnfinishedUploadsUseCase from '../../../application/usecases/AbortUnfinishedUploads/AbortUnfinishedUploadsUseCase';
import DownloadFileUseCase from '../../../application/usecases/DownloadFile/DownloadFileUseCase';
import DeleteFileUseCase from '../../../application/usecases/DeleteFile/DeleteFileUseCase';
import S3FileStorage from '../../../infrastructure/FileStorage/S3FileStorage';
import MongooseFileGateway from '../../../infrastructure/gateways/FileGateway/MongooseFileGateway';
import { ErrorResponseDTO } from '../../types/custom';

type InitiateUploadRequestDTO = {
  fileSize: number;
  fileName: string;
  folderId: string;
};

type InitiateUploadResponseDTO =
  | {
      uploadId: string;
      urls: string[];
      partSize: number;
    }
  | ErrorResponseDTO;

type FinishUploadRequestDTO = {
  fileId: string;
  etags: string[];
  uploadId: string;
};

type FinishUploadResponseDTO = ErrorResponseDTO | undefined;

type DownloadFileResponseDTO = { url: string } | ErrorResponseDTO;

const router = Router();

const fileStorage = new S3FileStorage();
const fileGateway = new MongooseFileGateway();

router.post<{}, InitiateUploadResponseDTO, InitiateUploadRequestDTO>(
  '/initiateUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const uploadInfo = await new InitiateFileUploadUseCase(fileStorage, fileGateway).execute({
        fileName: req.body.fileName,
        fileSize: req.body.fileSize,
        owner: req.user!.id,
        folderId: req.body.folderId,
      });

      res.send(uploadInfo);
    } catch (e: any) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.post<{}, FinishUploadResponseDTO, FinishUploadRequestDTO>(
  '/finishUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await new FinishFileUploadUseCase(fileStorage, fileGateway).execute({
        fileId: req.body.fileId,
        etags: req.body.etags,
        uploadId: req.body.uploadId,
      });
      res.status(204).end();
    } catch (e: any) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.get<{ fileId: string }, DownloadFileResponseDTO>(
  '/:fileId/download',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const url = await new DownloadFileUseCase(fileStorage, fileGateway).execute({
        fileId: req.params.fileId,
        userId: req.user!.id,
      });

      return res.send({ url });
    } catch (e: any) {
      return res.status(404).send({ error: e.message });
    }
  }
);

router.delete<{ fileId: string }>(
  '/:fileId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    await new DeleteFileUseCase(fileStorage, fileGateway).execute({
      fileId: req.params.fileId,
      userId: req.user!.id,
    });
    return res.status(204).end();
  }
);

// This is intended for dev purposes only
// Aborts all unfinished uploads
router.post(
  '/abortUploads',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await new AbortUnfinishedUploadsUseCase(fileStorage).execute({ user: req.user! });
      return res.status(200).send();
    } catch (e: any) {
      return res.send({ error: e.message });
    }
  }
);

export default router;
