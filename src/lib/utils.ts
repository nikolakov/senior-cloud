import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

/**
 *
 * @param key - Base64-encoded public/private RSA key
 */
export const decodeBase64Key = (key: string) => {
  return Buffer.from(key, 'base64').toString('ascii');
};

if (
  !process.env.ACCESS_TOKEN_PUBLIC_KEY ||
  !process.env.ACCESS_TOKEN_PRIVATE_KEY ||
  !process.env.REFRESH_TOKEN_PUBLIC_KEY ||
  !process.env.REFRESH_TOKEN_PRIVATE_KEY
) {
  throw new Error('Missing RSA key pairs');
}

export const config = {
  accessTokenPublicKey: decodeBase64Key(process.env.ACCESS_TOKEN_PUBLIC_KEY),
  accessTokenPrivateKey: decodeBase64Key(process.env.ACCESS_TOKEN_PRIVATE_KEY),
  refreshTokenPublicKey: decodeBase64Key(process.env.REFRESH_TOKEN_PUBLIC_KEY),
  refreshTokenPrivateKey: decodeBase64Key(process.env.REFRESH_TOKEN_PRIVATE_KEY),
};

/**
 *
 * @param password - The plain text password
 * @param hash - The hash stored in the database
 * @param salt - The salt stored in the database
 *
 * This function uses the crypto library to generate a new hash
 * from the provided password and the salt stored in the database
 * and then compares it with the hash stored in the database
 */
export const validatePassword = (password: string, hash: string, salt: string) => {
  return new Promise<boolean>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        const hashVerify = derivedKey.toString('hex');
        resolve(hash === hashVerify);
      }
    });
  });
};

/**
 *
 * @param password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 */
export const genPassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString('hex');

  return new Promise<{ salt: string; hash: string }>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        const genHash = derivedKey.toString('hex');
        resolve({ salt, hash: genHash });
      }
    });
  });
};

/**
 * @param userId - Used to set the JWT `sub` payload property to the user ID
 * @param expiresIn - `Optional` The expiration period of the token in string format, e.g. 2s, 4h or 1d. Defaults to 1d
 */
export const issueJWT = (
  userId: string,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  expiresIn: string = '1d'
) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };

  const signedToken = jsonwebtoken.sign(payload, config[key], {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
};

export const verifyJWT = (token: string, key: 'accessTokenPublicKey' | 'refreshTokenPublicKey') =>
  jsonwebtoken.verify(token, config[key]);
