require('dotenv/config');
const mongoose = require('mongoose');

main = async () => {
  let total = 0;

  const FileSchema = new mongoose.Schema({
    name: String,
    owner: mongoose.Schema.Types.ObjectId,
    fileSize: Number,
    uploaded: { type: Boolean, default: false },
    createdAt: Number,
    modifiedAt: Number,
    deletedAt: String,
  });

  const FileModel = mongoose.model('File', FileSchema);

  if (process.env.MONGO_URI) {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI);
      mongoose.connection.on('connected', async () => {
        console.log('[server.ts] Connected to database');

        const res = await FileModel.find();

        const promises = res
          .filter(doc => doc.createdAt === undefined)
          .map(doc => {
            doc.createdAt = doc.modifiedAt;
            console.log(`Found file ${doc.id} without createdAt. Updating...`);
            total++;
            return doc.save();
          });

        await Promise.all(promises);
        console.log(`total records updated: ${promises.length}`);
        mongoose.connection.close();
        resolve();
      });

      mongoose.connection.on('error', () => {
        reject();
      });
    });
  } else {
    throw new Error('Missing configuration variables');
  }

  return;
};

main();
