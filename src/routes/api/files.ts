import { Router } from 'express';
import passport from 'passport';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import UploadJob from '../../models/uploadJob';
import File from '../../models/file';
import { CreateJobRequestDTO, CreateJobResponseDTO, TempJWTResponseDTO } from 'types/file';
import config from '../../config';
import * as utils from '../../lib/utils';
import JWTDownloadVerifier from '../../middlewares/JWTDownloadVerifier';

const router = Router();

router.post<{}, CreateJobResponseDTO, CreateJobRequestDTO>(
  '/createUploadJob',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { fileSize, fileName } = req.body;

    if (fileSize > config.maxFilesize) {
      return res.status(400).send({ error: 'exceed_file_size_limit' });
    }

    const chunks = Math.ceil(fileSize / config.chunkSize);

    const newJob = new UploadJob({
      fileId: new mongoose.Types.ObjectId(),
      name: fileName,
      owner: req.user?._id,
      fileSize,
      totalChunks: chunks,
      chunksCount: 0,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });

    const job = await newJob.save();

    res.send({ jobId: job._id, chunkSize: config.chunkSize });
  }
);

router.post('/upload', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).send({ error: 'missing_job_id' });
  }

  const job = await UploadJob.findOne({ _id: jobId });

  if (!job) {
    return res.status(400).send({ error: 'job_not_found' });
  }

  const uploadDir = `${process.cwd()}/uploads`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  fs.appendFileSync(path.join(uploadDir, job.fileId.toString()), req.body);

  const newCount = job.chunksCount + 1;
  await job.updateOne({ chunksCount: newCount, modifiedAt: Date.now() });

  if (newCount === job.totalChunks) {
    const newFile = new File({
      _id: job.fileId,
      name: job.name,
      owner: job.owner,
      fileSize: job.fileSize,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });

    await newFile.save();
  }

  res.status(200).end();
});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const files = await File.find({ owner: req.user?._id });

  res.send(files);
});

router.get<{}, TempJWTResponseDTO, {}>(
  '/tempJWT',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    try {
      if (req.user) {
        const { token } = utils.issueJWT(req.user, '3s');

        res.send({ token });
      }
    } catch (e) {
      next(e);
    }
  }
);

router.get('/:userId/:fileId/download', JWTDownloadVerifier, async (req, res) => {
  const { fileId, userId } = req.params;
  const file = await File.findOne({ _id: fileId, owner: userId });

  if (!file) {
    return res.status(404).end();
  }

  const path = `${process.cwd()}/uploads/${file._id}`;

  res.download(path, file.name);
});

router.delete('/:fileId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, owner: req.user?._id });

    if (file) {
      const path = `${process.cwd()}/uploads/${fileId}`;

      console.log(`deleting ${file.name}...`);

      fs.unlink(path, () => {
        console.log(`file ${file.name} deleted`);
      });

      await file.delete();
    }
  } catch (e: any) {
    console.log(e.message);
  }

  res.status(204).end();
});

export default router;
