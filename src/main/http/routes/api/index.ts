import { Router } from 'express';
import passport from 'passport';

import files from './files';
import users from './users';
import folders from './folders';
import MongooseFolderGateway from '../../../infrastructure/gateways/FolderGateway/MongooseFolderGateway';
import GetRootFolderUseCase from '../../..//application/usecases/GetRootFolder/GetRootFolderUseCase';

const router = Router();
const folderGateway = new MongooseFolderGateway();

// Returns a response with server timestamp. Used for synchronization
router.get('/serverTimeJson', (req, res) => {
  res.send({ timestamp: new Date().getTime() });
});

router.get('/serverTime', (req, res) => {
  res.send(new Date().getTime().toString());
});

router.get('/secretTime', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ secretTime: new Date().getTime() });
});

router.get('/profileInfo', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.user) return res.status(401).send({ error: 'user_not_found' });

  const rootFolder = await new GetRootFolderUseCase(folderGateway).execute({
    ownerId: req.user.id,
  });

  res.send({ ...req.user, rootFolder });
});

router.use('/files', files);
router.use('/users', users);
router.use('/folders', folders);

export default router;
