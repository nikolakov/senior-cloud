import { Router } from 'express';
import passport from 'passport';

import files from './files';
import users from './users';

const router = Router();

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

router.get('/profileInfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

router.use('/files', files);
router.use('/users', users);

export default router;
