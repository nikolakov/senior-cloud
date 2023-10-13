import { Router } from 'express';
import axios from 'axios';

import { LoginRequestDTO, RegisterRequestDTO } from '../types/auth';

import MongooseUserGateway from '../../infrastructure/gateways/UserGateway/MongooseUserGateway';
import MongooseFolderGateway from '../../infrastructure/gateways/FolderGateway/MongooseFolderGateway';
import MongooseTokenFamilyGateway from '../../infrastructure/gateways/TokenFamilyGateway/MongooseTokenFamilyGateway';
import RegisterUserUseCase from '../../application/usecases/RegisterUser/RegisterUserUseCase';
import LoginUserUseCase from '../../application/usecases/LoginUser/LoginUserUseCase';
import GetRootFolderUseCase from '../../application/usecases/GetRootFolder/GetRootFolderUseCase';
import JWTAuthenticationManager from '../authentication/JWTAuthenticationManager';

const userGateway = new MongooseUserGateway();
const folderGateway = new MongooseFolderGateway();
const tokenFamilyGateway = new MongooseTokenFamilyGateway();

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

    const { accessToken, refreshToken } = await new JWTAuthenticationManager(
      tokenFamilyGateway
    ).issueTokens(user.id);

    const rootFolder = await new GetRootFolderUseCase(folderGateway).execute({
      ownerId: user.id,
    });

    res.json({ user: { ...user, rootFolder }, accessToken, refreshToken });
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

    const { accessToken, refreshToken } = await new JWTAuthenticationManager(
      tokenFamilyGateway
    ).issueTokens(user.id);

    const rootFolder = await new GetRootFolderUseCase(folderGateway).execute({
      ownerId: user.id,
    });

    res.json({ user: { ...user, rootFolder }, accessToken, refreshToken });
  } catch (e: any) {
    res.status(409).send({ error: e.message });
  }
});

router.post<{}, any, { refreshToken: string }>('/refresh-token', async (req, res, next) => {
  try {
    const oldRefreshToken = req.body.refreshToken;

    const { accessToken, refreshToken } = await new JWTAuthenticationManager(
      tokenFamilyGateway
    ).refreshTokens(oldRefreshToken);

    return res.send({ accessToken, refreshToken });
  } catch (e) {
    return res.status(401).send();
  }
});

export default router;
