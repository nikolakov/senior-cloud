import { Router } from 'express';
import passport from 'passport';

import GetFolderFilesUseCase from '../../../application/usecases/GetFolderFiles/GetFolderFilesUseCase';
import MongooseFileGateway from '../../../infrastructure/gateways/FileGateway/MongooseFileGateway';
import { FileBoundaryDTO } from '../../../domain/entities/File';
import { FolderBoundaryDTO } from '../../../domain/entities/Folder';
import CreateFolderUseCase from '../../../application/usecases/CreateFolder/CreateFolderUseCase';
import MongooseFolderGateway from '../../../infrastructure/gateways/FolderGateway/MongooseFolderGateway';

type ErrorResponseDTO = { error: string };

type CreateFolderRequestDTO = {
  name: string;
  parentFolderId: string;
};

const router = Router();

const fileGateway = new MongooseFileGateway();
const folderGateway = new MongooseFolderGateway();

router.get<{ folderId: string }, FileBoundaryDTO[] | ErrorResponseDTO>(
  '/:folderId/files',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const files = await new GetFolderFilesUseCase(fileGateway).execute({
        folderId: req.params.folderId,
      });

      res.send(files);
    } catch (e: any) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.post<{}, FolderBoundaryDTO | ErrorResponseDTO, CreateFolderRequestDTO>(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const folder = await new CreateFolderUseCase(folderGateway).execute({
        name: req.body.name,
        parentFolderId: req.body.parentFolderId,
        owner: req.user?.id as string,
      });

      res.send(folder);
    } catch (e: any) {
      res.status(400).send({ error: e.message });
    }
  }
);

router.delete<{ folderId: string }>(
  '/:folderId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    // await new DeleteFileUseCase(fileStorage, fileGateway).execute({ fileId: req.params.fileId });
    return res.status(204).end();
  }
);

export default router;
