import express from 'express';
import { PassportStatic } from 'passport';
import { Strategy as PassportStrategy } from 'passport-strategy';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions as JWTStrategyOptions,
} from 'passport-jwt';

import UserGateway from '../infrastructure/gateways/UserGateway/UserGateway';

interface AuthenticationService {
  getMiddleware(): express.Handler;
}

class PassportAuthenticationService implements AuthenticationService {
  private passport: PassportStatic;
  private publicKey: string;
  private userGateway: UserGateway;

  constructor(passport: PassportStatic, publicKey: string, userGateway: UserGateway) {
    this.passport = passport;
    this.publicKey = publicKey;
    this.userGateway = userGateway;

    const strategy = this.generateJWTStrategy();
    this.configure(strategy);
  }

  getMiddleware() {
    return this.passport.initialize();
  }

  private generateJWTStrategy() {
    return new JwtStrategy(this.generateJWTOptions(), async (payload, done) => {
      try {
        const user = await this.userGateway.findById(payload.sub);

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (e) {
        done(e, false);
      }
    });
  }

  private generateJWTOptions(): JWTStrategyOptions {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.publicKey,
      algorithms: ['RS256'],
    };
  }

  private configure(strategy: PassportStrategy) {
    this.passport.use(strategy);
  }
}

export default PassportAuthenticationService;
