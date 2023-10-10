import { Router } from 'express';
import passport from 'passport';

import { UpdateUserRequestDTO } from '../../types/user';

import MongooseUserGateway from '../../../infrastructure/gateways/UserGateway/MongooseUserGateway';
import UpdateUserUseCase from '../../../application/usecases/UpdateUser/UpdateUserUseCase';

const router = Router();

const userGateway = new MongooseUserGateway();

router.patch<{ userId: string }, any, UpdateUserRequestDTO>(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { userId } = req.params;
    if (userId !== req.user?.id) return res.status(403).send();

    try {
      const user = await new UpdateUserUseCase(userGateway).execute({
        id: userId,
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      res.send(user);
    } catch (e: any) {
      if (e.message === 'user_not_found') res.status(404).send({ error: e.message });
      else res.status(409).send({ error: e.message });
    }
  }
);

export default router;
