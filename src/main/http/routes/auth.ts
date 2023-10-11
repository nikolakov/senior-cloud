import { Router } from 'express';
import axios from 'axios';

import * as utils from '../../../lib/utils';
import { LoginRequestDTO, RegisterRequestDTO } from '../types/auth';

import MongooseUserGateway from '../../infrastructure/gateways/UserGateway/MongooseUserGateway';
import MongooseFolderGateway from '../../infrastructure/gateways/FolderGateway/MongooseFolderGateway';
import RegisterUserUseCase from '../../application/usecases/RegisterUser/RegisterUserUseCase';
import LoginUserUseCase from '../../application/usecases/LoginUser/LoginUserUseCase';
import GetRootFolderUseCase from '../../application/usecases/GetRootFolder/GetRootFolderUseCase';

const userGateway = new MongooseUserGateway();
const folderGateway = new MongooseFolderGateway();

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

const getTokenPair = (userId: string) => {
  const { token: accessToken, expiresIn } = utils.issueJWT(
    userId,
    'accessTokenPrivateKey',
    process.env.ACCESS_TOKEN_EXP
  );
  const { token: refreshToken } = utils.issueJWT(
    userId,
    'refreshTokenPrivateKey',
    process.env.REFRESH_TOKEN_EXP
  );

  return { accessToken, refreshToken, expiresIn };
};

const router = Router();

router.post<{}, any, LoginRequestDTO>('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await new LoginUserUseCase(userGateway).execute({ username, password });

    const { accessToken, refreshToken, expiresIn } = getTokenPair(user.id);

    const rootFolder = await new GetRootFolderUseCase(folderGateway).execute({
      ownerId: user.id,
    });

    res.json({ user: { ...user, rootFolder }, accessToken, refreshToken, expiresIn });
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
    const user = await new RegisterUserUseCase(userGateway, folderGateway).execute({
      username,
      email,
      password,
    });

    const { accessToken, refreshToken, expiresIn } = getTokenPair(user.id);

    const rootFolder = await new GetRootFolderUseCase(folderGateway).execute({
      ownerId: user.id,
    });

    res.json({ user: { ...user, rootFolder }, accessToken, refreshToken, expiresIn });
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

  const { accessToken, refreshToken } = getTokenPair(user.id);

  return res.send({ accessToken, refreshToken });
});

export default router;
