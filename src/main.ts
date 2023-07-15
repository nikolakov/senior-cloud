import passport from 'passport';
import mongoose from 'mongoose';
import 'dotenv/config';

import Server from './main/http/server';
import PassportAuthenticationService from './main/http/configPassport';
import MongooseUserGateway from './main/infrastructure/gateways/UserGateway/MongooseUserGateway';
import * as utils from './lib/utils';

const main = () => {
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on('connected', () => {
      console.log('[server.ts] Connected to database');
    });
  } else {
    throw new Error('Missing configuration variables');
  }

  const userGateway = new MongooseUserGateway();
  const passportService = new PassportAuthenticationService(
    passport,
    utils.config.accessTokenPublicKey,
    userGateway
  );
  const server = new Server(passportService.getMiddleware());

  const PORT = process.env.PORT || 8000;

  server.listen(PORT);
};

main();
