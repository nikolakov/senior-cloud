import { Router } from 'express';
import passport from 'passport';

import User from '../../models/user';
import { IUser, UpdateUserApi } from '../../types/user';

const router = Router();

router.patch<{ userId: string }, any, UpdateUserApi>(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { userId } = req.params;

    if (userId !== req.user?._id.toString()) {
      return res.status(403).send();
    }

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).send();
    }

    const userWithSameName = await User.findOne({
      _id: { $ne: userId },
      username: req.body.username,
    });

    if (userWithSameName) {
      return res.status(405).send({ error: 'username_in_use' });
    }

    const userWithSameEmail = await User.findOne({
      _id: { $ne: userId },
      email: req.body.email,
    });

    if (userWithSameEmail) {
      return res.status(405).send({ error: 'email_in_use' });
    }

    await user.updateOne({ ...req.body });

    const updated = await User.findOne({ _id: req.user._id });

    res.send(updated);
  }
);

export default router;
