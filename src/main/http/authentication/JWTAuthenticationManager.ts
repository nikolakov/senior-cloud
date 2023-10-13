import jsonwebtoken from 'jsonwebtoken';

import TokenFamily from '../../domain/entities/TokenFamily';
import { config } from '../../../lib/utils';
import TokenFamilyGateway from '../../infrastructure/gateways/TokenFamilyGateway/TokenFamilyGateway';

class JWTAuthenticationManager {
  tokenFamilyGateway: TokenFamilyGateway;

  constructor(tokenFamilyGateway: TokenFamilyGateway) {
    this.tokenFamilyGateway = tokenFamilyGateway;
  }

  async issueTokens(userId: string) {
    const accessToken = this.issueAccessToken(userId);
    const refreshToken = await this.issueInitialRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  async refreshTokens(oldRefreshToken: string) {
    const payload = this.verifyJWT(oldRefreshToken, 'refreshTokenPublicKey') as {
      sub: string;
      familyId: string;
      index: number;
    };

    const { sub, familyId, index } = payload;

    const accessToken = this.issueAccessToken(sub);
    const refreshToken = await this.issueSubsequentRefreshToken(familyId, sub, index);

    return { accessToken, refreshToken };
  }

  private verifyJWT(token: string, key: 'accessTokenPublicKey' | 'refreshTokenPublicKey') {
    return jsonwebtoken.verify(token, config[key], {
      algorithms: ['RS256'],
    });
  }

  private issueAccessToken(userId: string) {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    };

    const signedToken = jsonwebtoken.sign(payload, config.accessTokenPrivateKey, {
      expiresIn: process.env.ACCESS_TOKEN_EXP,
      algorithm: 'RS256',
    });

    return signedToken;
  }

  private async issueInitialRefreshToken(userId: string) {
    const family = new TokenFamily();
    family.userId = userId;
    family.index = 0;
    family.invalidated = false;

    const newlyCreatedFamily = await this.tokenFamilyGateway.create(family);

    if (!newlyCreatedFamily) throw new Error();
    return this.issueTokenFromFamily(newlyCreatedFamily);
  }

  private async issueSubsequentRefreshToken(familyId: string, userId: string, index: number) {
    const family = await this.tokenFamilyGateway.findById(familyId);

    if (!family) throw new Error();
    if (userId !== family.userId) throw new Error();
    if (family.invalidated) throw new Error();

    if (index !== family.index) {
      family.invalidated = true;
      await this.tokenFamilyGateway.update(family);
      throw new Error();
    }

    return this.issueTokenFromFamily(family);
  }

  private async issueTokenFromFamily(family: TokenFamily) {
    family.index += 1;

    const updatedFamily = await this.tokenFamilyGateway.update(family);

    if (!updatedFamily) throw new Error();

    const payload = {
      sub: updatedFamily.userId,
      iat: Math.floor(Date.now() / 1000),
      familyId: updatedFamily.id,
      index: updatedFamily.index,
    };

    const signedToken = jsonwebtoken.sign(payload, config.refreshTokenPrivateKey, {
      expiresIn: process.env.REFRESH_TOKEN_EXP,
      algorithm: 'RS256',
    });

    return signedToken;
  }
}

export default JWTAuthenticationManager;
