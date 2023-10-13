import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../../lib/utils';

class AccessTokenIssuer {
  issueAccessToken(userId: string) {
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
}

export default AccessTokenIssuer;
