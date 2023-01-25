import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { IUser } from '../types/user';

const keyPath = path.join(process.cwd(), 'cert', 'private.pem');
let PRIVATE_KEY: string;

try {
  PRIVATE_KEY = fs.readFileSync(keyPath, 'utf-8');
} catch (e) {
  if (process.env.PRIVATE_KEY) {
    PRIVATE_KEY = process.env.PRIVATE_KEY;
  } else {
    throw new Error('No RSA Private Key');
  }
}

const pubKeyPath = path.join(process.cwd(), 'cert', 'public.pem');
let PUB_KEY: string;

try {
  PUB_KEY = fs.readFileSync(pubKeyPath, 'utf-8');
} catch (e) {
  if (process.env.PUB_KEY) {
    PUB_KEY = process.env.PUB_KEY;
  } else {
    throw new Error('No RSA Public Key');
  }
}

/**
 *
 * @param password - The plain text password
 * @param hash - The hash stored in the database
 * @param salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
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
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
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
export const issueJWT = (userId: string, expiresIn: string = '1d') => {
  const payload = {
    sub: userId,
    iat: Date.now() / 1000,
  };

  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
};

export const verifyJWT = (token: string) => jsonwebtoken.verify(token, PUB_KEY);
