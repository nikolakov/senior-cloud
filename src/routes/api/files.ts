import { Router } from 'express';
import passport from 'passport';

import FileService, { InitiateUploadFileInfo } from '../../domain/FileService';
import { InitiateUploadOutput, FinishUploadInput } from '../../domain/FileStorage';
import S3FileStorage from '../../domain/S3FileStorage';

type ErrorResponseDTO = { error: string };
type InitiateUploadRequestDTO = Omit<InitiateUploadFileInfo, 'owner'>;
type InitiateUploadResponseDTO = InitiateUploadOutput | ErrorResponseDTO;
type FinishUploadRequestDTO = FinishUploadInput;
type FinishUploadResponseDTO = ErrorResponseDTO | undefined;
type DownloadFileResponseDTO = { url: string } | ErrorResponseDTO;

const router = Router();

const fileStorage = new S3FileStorage();
const fileService = new FileService(fileStorage);

router.post<{}, InitiateUploadResponseDTO, InitiateUploadRequestDTO>(
  '/initiateUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const uploadInfo = await fileService.initiateUpload({
        fileName: req.body.fileName,
        fileSize: req.body.fileSize,
        owner: req.user?._id as string,
      });

      return res.send(uploadInfo);
    } catch (e: any) {
      return res.send({ error: e.message });
    }
  }
);

router.post<{}, FinishUploadResponseDTO, FinishUploadRequestDTO>(
  '/finishUpload',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await fileService.finishUpload(req.body);
      return res.status(204).end();
    } catch (e: any) {
      return res.send({ error: e.message });
    }
  }
);

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const files = await fileService.getFiles(req.user?._id as string);

  res.send(files);
});

router.get<{ fileId: string }, DownloadFileResponseDTO>(
  '/:fileId/download',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const url = await fileService.getFileDownloadUrl(req.params.fileId, req.user?._id as string);
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
    try {
      await fileService.deleteFile(req.params.fileId, req.user?._id as string);
    } catch (e: any) {}

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
      await fileService.abortUploads();
      return res.status(200).send();
    } catch (e: any) {
      return res.send({ error: e.message });
    }
  }
);

export default router;
