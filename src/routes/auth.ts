import { Router } from 'express';
import axios from 'axios';

import User from '../models/user';
import * as utils from '../lib/utils';
import { LoginRequestDTO, AuthResponseDTO, RegisterRequestDTO } from 'types/auth';
import config from '../config';

const validateCaptcha = async (token: string) => {
  try {
    const res = await axios.post<{ success: boolean }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaSecretKey}&response=${token}`
    );

    return res.data.success;
  } catch (e) {
    return false;
  }
};

const router = Router();

router.post<{}, AuthResponseDTO, LoginRequestDTO>('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send({ error: 'user_not_found' });
    }

    const isValid = await utils.validatePassword(password, user.hash, user.salt);

    if (isValid) {
      const { token, expiresIn } = utils.issueJWT(user);

      res.json({ user, token, expiresIn });
    } else {
      res.status(401).send({ error: 'incorrect_password' });
    }
  } catch (e) {
    next(e);
  }
});

router.post<{}, AuthResponseDTO, RegisterRequestDTO>('/register', async (req, res, next) => {
  try {
    const { username, email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).send({ error: 'recaptcha_required' });
    }

    const captchaIsValid = await validateCaptcha(recaptchaToken);

    if (!captchaIsValid) {
      return res.status(401).send({ error: 'recaptcha_failed' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send({ error: 'username_exists' });
    }

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
