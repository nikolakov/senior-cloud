import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport';

import config from './config';
import configPassport from './configPassport';
import routes from './routes';
import { isAddressInfo } from './types/custom';
import createInitialUser from './lib/createInitialUser';

// create express app
const app = express();

// Connect to db
if (config.database) {
  mongoose.connect(config.database);
  mongoose.connection.on('connected', () => {
    console.log('[server.ts] Connected to database');
    createInitialUser();
  });
} else {
  throw new Error('Missing configuration variables');
}

// Standard express middlewares
app.use(express.json()).use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
configPassport(passport);

app.use(routes);

// app should be your express app
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client', 'build', 'index.html'));
  });
} else {
  app.use(express.static('public'));
}

// define port
const PORT = config.port;

// start server
server.listen(PORT, () => {
  const addressInfo = server.address();
  if (addressInfo && isAddressInfo(addressInfo)) {
    const host = addressInfo.address;
    const port = addressInfo.port;

    console.log(`[server.ts] WS app server listening at http://${host}:${port}`);
  } else {
    console.log(`[server.ts] WS app server listening at http://${addressInfo}`);
  }
});
