import jsonwebtoken from 'jsonwebtoken';

import TokenFamily from '../../domain/entities/TokenFamily';
import { config } from '../../../lib/utils';
import TokenFamilyGateway from '../../infrastructure/gateways/TokenFamilyGateway/TokenFamilyGateway';

class RefreshTokenIssuer {
  tokenFamilyGateway: TokenFamilyGateway;

  constructor(tokenFamilyGateway: TokenFamilyGateway) {
    this.tokenFamilyGateway = tokenFamilyGateway;
  }

  async issueInitialRefreshToken(userId: string) {
    const family = new TokenFamily();
    family.userId = userId;
    family.index = 0;
    family.invalidated = false;

    const newlyCreatedFamily = await this.tokenFamilyGateway.create(family);

    if (!newlyCreatedFamily) {
      throw new Error('could_not_issue_refresh_token');
    }

    return this.issueTokenFromFamily(newlyCreatedFamily);
  }

  async issueSubsequentRefreshToken(familyId: string, userId: string, index: number) {
    const family = await this.tokenFamilyGateway.findById(familyId);

    if (!family) {
      throw new Error('could_not_issue_refresh_token');
    }

    if (userId !== family.userId) {
      throw new Error('could_not_issue_refresh_token');
    }

    if (index !== family.index) {
      family.invalidated = true;
      this.tokenFamilyGateway.update(family);
      throw new Error('could_not_issue_refresh_token');
    }

    if (family.invalidated) {
      throw new Error('could_not_issue_refresh_token');
    }

    return this.issueTokenFromFamily(family);
  }

  private async issueTokenFromFamily(family: TokenFamily) {
    family.index += 1;

    const updatedFamily = await this.tokenFamilyGateway.update(family);

    if (!updatedFamily) {
      throw new Error('could_not_issue_refresh_token');
    }

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

export default RefreshTokenIssuer;
