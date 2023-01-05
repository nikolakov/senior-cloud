import File from '../models/file';
import FileStorage, { InitiateUploadInput, FinishUploadInput } from './FileStorage';

export type InitiateUploadFileInfo = Omit<InitiateUploadInput, 'fileId'> & {
  owner: string;
  fileName: string;
};

class FileService {
  private fileStorage: FileStorage;

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  async initiateUpload(fileInfo: InitiateUploadFileInfo) {
    const newFile = new File({
      name: fileInfo.fileName,
      owner: fileInfo.owner,
      fileSize: fileInfo.fileSize,
    });

    const file = await newFile.save();
    const fileId = file._id.toString();

    const res = await this.fileStorage.initiateUpload({ fileId, fileSize: fileInfo.fileSize });

    return {
      ...res,
      fileId,
    };
  }

  async finishUpload(fileInfo: FinishUploadInput) {
    const file = await File.findOne({ _id: fileInfo.fileId });

    if (!file) throw new Error('file_not_found');
    // res.status(400).send({ error: 'file_not_found' });

    await this.fileStorage.finishUpload(fileInfo);

    await file.updateOne({ uploaded: true, modifiedAt: Date.now() });
  }

  async getFiles(userId: string) {
    return await File.find({ owner: userId, uploaded: true, deletedAt: undefined });
  }

  async getFileDownloadUrl(fileId: string, userId: string) {
    const file = await File.findOne({ _id: fileId, uploaded: true, deletedAt: undefined });

    if (!file) throw new Error('file_not_found');

    return await this.fileStorage.createDownloadUrl({ fileId, fileName: file.name });
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await File.findOne({ _id: fileId, uploaded: true, deletedAt: undefined });

    if (!file) throw new Error('file_not_found');

    await file.updateOne({ deletedAt: Date.now() });
    await this.fileStorage.deleteFile(fileId);
  }

  async abortUploads() {
    if (!this.fileStorage.abortAllUploads) throw new Error('method_not_implemented');

    return await this.fileStorage.abortAllUploads();
  }
}

export default FileService;
