import { Router } from 'express';

import User from '../models/user';
import * as utils from '../lib/utils';
import { LoginRequestDTO, AuthResponseDTO, RegisterRequestDTO } from 'types/auth';

const router = Router();

router.post<{}, AuthResponseDTO, LoginRequestDTO>('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ error: 'user_not_found' });
    }

    const isValid = await utils.validatePassword(req.body.password, user.hash, user.salt);

    if (isValid) {
      const { token, expiresIn } = utils.issueJWT(user);

      res.json({ user, token, expiresIn });
    } else {
      res.status(401).json({ error: 'incorrect_password' });
    }
  } catch (e) {
    next(e);
  }
});

router.post<{}, AuthResponseDTO, RegisterRequestDTO>('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { salt, hash } = await utils.genPassword(password);

    const newUser = new User({
      username,
      email,
      hash,
      salt,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      deletedAt: undefined,
    });

    const user = await newUser.save();
    const { token, expiresIn } = utils.issueJWT(user);

    res.json({ user, token, expiresIn });
  } catch (e) {
    next(e);
  }
});

export default router;
