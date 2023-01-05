import fs from 'fs';
import path from 'path';
import User from './models/user';
import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

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

// TODO
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub });

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (e) {
    done(e, false);
  }
});

const configPassport = (passport: PassportStatic) => {
  passport.use(strategy);
};

export default configPassport;
