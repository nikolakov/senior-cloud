import express, { Express } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';

import routes from './routes';
import { isAddressInfo } from '../../types/custom';

class Server {
  private app: Express;
  private server: http.Server;

  constructor(authenticationMiddleware: express.Handler) {
    this.app = express();
    this.server = http.createServer(this.app);

    this.setupMiddlewares(authenticationMiddleware);
    this.setupRoutes();
  }

  listen(port: string | number) {
    this.server.listen(port, () => {
      const addressInfo = this.server.address();
      if (addressInfo && isAddressInfo(addressInfo)) {
        const host = addressInfo.address;
        const port = addressInfo.port;

        console.log(`[server.ts] WS app server listening at http://${host}:${port}`);
      } else {
        console.log(`[server.ts] WS app server listening at http://${addressInfo}`);
      }
    });
  }

  private setupMiddlewares(authenticationMiddleware: express.Handler) {
    this.app.use(express.json());
    this.app.use(express.raw());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(authenticationMiddleware);
  }

  private setupRoutes() {
    this.app.use(routes);

    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '../../../client/build')));

      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
      });
    }
  }
}

export default Server;
