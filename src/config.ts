import 'dotenv/config';

export default {
  database: process.env.MONGO_URI,
  port: process.env.PORT,
  maxFilesize: 20 * 1024 * 1024,
  maxStorage: 100 * 1024 * 1024,
  chunkSize: 100 * 1024,
};
