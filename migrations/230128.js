require('dotenv/config');
const mongoose = require('mongoose');

main = async () => {
  const UserSchema = new mongoose.Schema(
    {
      createdAt: mongoose.Schema.Types.Mixed,
      modifiedAt: mongoose.Schema.Types.Mixed,
      updatedAt: mongoose.Schema.Types.Mixed,
      deletedAt: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
  );

  const UserModel = mongoose.model('User', UserSchema);

  if (process.env.MONGO_URI) {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI);
      mongoose.connection.on('connected', async () => {
        console.log('[server.ts] Connected to database');

        const res = await UserModel.find();

        const promises = res.map(doc => {
          doc.createdAt = new Date(doc.createdAt);
          doc.modifiedAt = undefined;
          doc.updatedAt = new Date(doc.modifiedAt);
          if (doc.deletedAt) {
            doc.deletedAt = new Date(doc.deletedAt);
          }
          console.log(
            `changing user ${doc.id} createdAt, modifiedAt and deletedAt to date Objects. Updating...`
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
