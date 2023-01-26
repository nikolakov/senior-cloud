require('dotenv/config');
const mongoose = require('mongoose');

main = async () => {
  const FileSchema = new mongoose.Schema({
    name: String,
    owner: mongoose.Schema.Types.ObjectId,
    fileSize: Number,
    uploaded: { type: Boolean, default: false },
    createdAt: mongoose.Schema.Types.Mixed,
    deletedAt: mongoose.Schema.Types.Mixed,
  });

  const FileModel = mongoose.model('File', FileSchema);

  if (process.env.MONGO_URI) {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI);
      mongoose.connection.on('connected', async () => {
        console.log('[server.ts] Connected to database');

        const res = await FileModel.find();

        const promises = res.map(doc => {
          doc.createdAt = new Date(doc.createdAt);
          if (doc.deletedAt) {
            doc.deletedAt = new Date(doc.deletedAt);
          }
          console.log(
            `changing file ${doc.id} createdAt, modifiedAt and deletedAt to date Objects. Updating...`
          );
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
