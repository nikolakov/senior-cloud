import { RequestHandler } from 'express';

import * as utils from '../lib/utils';
import { ErrorResponseDTO } from 'types/common';

// Middlware for download Verifier
const JWTDownloadVerifier: RequestHandler<any, ErrorResponseDTO, {}, { token: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'token_not_found' });
    }
    utils.verifyJWT(token);
  } catch (err) {
    return res.status(403).json({ error: 'token_expired_or_invalid' });
  }

  return next();
};

export default JWTDownloadVerifier;
