require('dotenv/config');
const mongoose = require('mongoose');

main = async () => {
  const FileSchema = new mongoose.Schema(
    {
      owner: mongoose.Schema.Types.ObjectId,
      folder: mongoose.Schema.Types.ObjectId,
    },
    { timestamps: true }
  );

  const FileModel = mongoose.model('File', FileSchema);

  const FolderSchema = new mongoose.Schema(
    {
      name: String,
      owner: mongoose.Schema.Types.ObjectId,
    },
    { timestamps: true }
  );

  const FolderModel = mongoose.model('Folder', FolderSchema);

  if (process.env.MONGO_URI) {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI);
      mongoose.connection.on('connected', async () => {
        console.log('[server.ts] Connected to database');

        const res = await FileModel.find();

        for (let i = 0; i < res.length; i++) {
          const doc = res[i];
          const owner = doc.owner.toString();

          const rootFolder = await FolderModel.findOne({ owner, parentFolder: undefined });

          if (!rootFolder) console.log(doc._id.toString(), owner);

          // console.log(doc._id.toString(), owner, rootFolder._id.toString());

          await FileModel.findOneAndUpdate({ _id: doc._id }, { folder: rootFolder._id });
        }
        // const promises = res.map(async doc => {

        // });

        // await Promise.all(promises);
        // console.log(`total records updated: ${promises.length}`);
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
