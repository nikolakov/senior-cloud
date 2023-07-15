import { Router } from 'express';
import axios from 'axios';

import * as utils from '../../../lib/utils';
import { LoginRequestDTO, RegisterRequestDTO } from 'types/auth';

import MongooseUserGateway from '../../infrastructure/gateways/UserGateway/MongooseUserGateway';
import RegisterUserUseCase from '../../application/usecases/RegisterUser/RegisterUserUseCase';
import LoginUserUseCase from '../../application/usecases/LoginUser/LoginUserUseCase';

const userGateway = new MongooseUserGateway();

const validateCaptcha = async (token: string) => {
  try {
    const res = await axios.post<{ success: boolean }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    return res.data.success;
  } catch (e) {
    return false;
  }
};

const router = Router();

router.post<{}, any, LoginRequestDTO>('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await new LoginUserUseCase(userGateway).execute({ username, password });

    const { token: accessToken, expiresIn } = utils.issueJWT(
      user.id,
      'accessTokenPrivateKey',
      '10m'
    );
    const { token: refreshToken } = utils.issueJWT(user.id, 'refreshTokenPrivateKey', '1h');

    res.json({ user, accessToken, refreshToken, expiresIn });
  } catch (e: any) {
    res.status(401).send({ error: e.message });
  }
});

router.post<{}, any, RegisterRequestDTO>('/register', async (req, res, next) => {
  const { username, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) return res.status(400).send({ error: 'recaptcha_required' });
  const captchaIsValid = await validateCaptcha(recaptchaToken);
  if (!captchaIsValid) return res.status(401).send({ error: 'recaptcha_failed' });

  try {
    const user = await new RegisterUserUseCase(userGateway).execute({ username, email, password });

    const { token: accessToken, expiresIn } = utils.issueJWT(
      user.id,
      'accessTokenPrivateKey',
      '10m'
    );
    const { token: refreshToken } = utils.issueJWT(user.id, 'refreshTokenPrivateKey', '1h');

    res.json({ user, accessToken, refreshToken, expiresIn });
  } catch (e: any) {
    res.status(409).send({ error: e.message });
  }
});

router.post<{}, any, { refreshToken: string }>('/refresh-token', async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken;

  let decoded;
  try {
    decoded = utils.verifyJWT(oldRefreshToken, 'refreshTokenPublicKey');
  } catch (e) {
    return res.status(401).send();
  }

  if (!decoded || typeof decoded === 'string' || !decoded.sub) {
    return res.status(401).send();
  }

  const user = await userGateway.findById(decoded.sub);

  if (!user) {
    return res.status(401).send();
  }

  const { token: accessToken } = utils.issueJWT(user.id, 'accessTokenPrivateKey', '10m');
  const { token: refreshToken } = utils.issueJWT(user.id, 'refreshTokenPrivateKey', '1h');

  return res.send({ accessToken, refreshToken });
});

export default router;
