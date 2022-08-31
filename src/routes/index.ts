import auth from './auth';
import api from './api';
import { Router } from 'express';

const router = Router();

router.use('/auth', auth);
router.use('/api', api);

export default router;
