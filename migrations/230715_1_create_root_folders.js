require('dotenv/config');
const mongoose = require('mongoose');

main = async () => {
  const UserSchema = new mongoose.Schema(
    {
      username: mongoose.Schema.Types.String,
      createdAt: mongoose.Schema.Types.Mixed,
      modifiedAt: mongoose.Schema.Types.Mixed,
      updatedAt: mongoose.Schema.Types.Mixed,
      deletedAt: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
  );

  const UserModel = mongoose.model('User', UserSchema);

  const FolderSchema = new mongoose.Schema(
    {
      name: String,
      owner: mongoose.Schema.Types.ObjectId,
      parentFolder: mongoose.Schema.Types.ObjectId,
    },
    { timestamps: true }
  );

  const FolderModel = mongoose.model('Folder', FolderSchema);

  if (process.env.MONGO_URI) {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI);
      mongoose.connection.on('connected', async () => {
        console.log('[server.ts] Connected to database');

        const res = await UserModel.find();

        const promises = res.map(doc => {
          const folderDoc = new FolderModel({
            name: doc.username,
            owner: doc._id.toString(),
          });

          return folderDoc.save();
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
