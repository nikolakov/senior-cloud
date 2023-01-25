import fs from 'fs';
import path from 'path';
import passport from 'passport';
import mongoose from 'mongoose';
import 'dotenv/config';

import Server from './main/http/server';
import PassportAuthenticationService from './main/http/configPassport';
import MongooseUserGateway from './main/infrastructure/gateways/UserGateway/MongooseUserGateway';

const main = () => {
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

  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on('connected', () => {
      console.log('[server.ts] Connected to database');
    });
  } else {
    throw new Error('Missing configuration variables');
  }

  const userGateway = new MongooseUserGateway();
  const passportService = new PassportAuthenticationService(passport, PUB_KEY, userGateway);
  const server = new Server(passportService.getMiddleware());

  const PORT = process.env.PORT || 8000;

  server.listen(PORT);
};

main();
