// import User from '../models/user';
// import { Role } from '../types/user';
// import * as utils from './utils';

// const createInitialUser = async () => {
//   if (!process.env.INITIAL_USER_USERNAME || !process.env.INITIAL_USER_PASSWORD) {
//     console.log(
//       '[createInitialUser.ts] Initial user credentials not provided. Skipping initial user creation.'
//     );
//     return;
//   }

//   const username = process.env.INITIAL_USER_USERNAME;
//   const password = process.env.INITIAL_USER_PASSWORD;
//   const email = process.env.INITIAL_USER_EMAIL;

//   const user = await User.findOne({ username });

//   if (!user) {
//     console.log('[createInitialUser.ts] Initial user not found in database');
//     console.log('[createInitialUser.ts] Creating initial user...');

//     const { salt, hash } = await utils.genPassword(password);

//     const newUser = new User({
//       username,
//       email,
//       hash,
//       salt,
//       createdAt: Date.now(),
//       modifiedAt: Date.now(),
//       deletedAt: undefined,
//       role: Role.User,
//     });

//     await newUser.save();

//     console.log('[createInitialUser.ts] Initial user created.');
//     console.warn('[createInitialUser.ts] Creating an initial user this way is a security risk.');
//     console.warn('[createInitialUser.ts] Please, remember to change initial user password ASAP!');
//   } else {
//     console.log(
//       '[createInitialUser.ts] Initial user already exists. Skipping initial user creation.'
//     );
//   }
// };

// export default createInitialUser;

export default {};
