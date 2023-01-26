import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { FileFromApi, InitiateUploadResponse } from 'types';
import ApiService from './ApiService';

const endpoint = '/files';

class FilesService {
  static async uploadFile(file: File, onProgress: (fileProgress: number) => void) {
    await new FileUploader(file, onProgress).uploadFile();
  }

  static getFiles() {
    return ApiService.get<FileFromApi[]>(`${endpoint}`);
  }

  static download(fileId: string) {
    new FileDownloader(fileId).download();
  }

  static delete(fileId: string) {
    return ApiService.delete(`${endpoint}/${fileId}`);
  }
}

class FileUploader {
  private file: File;
  private fileName: string;
  private fileType: string;
  private fileSize: number;
  private onProgress: (fileProgress: number) => void;

  private urls: string[] = [];
  private partSize: number = 0;
  private uploadId: string = '';
  private fileId: string = '';
  private etags: string[] = [];

  constructor(file: File, onProgress: (fileProgress: number) => void) {
    this.file = file;
    this.fileName = file.name;
    this.fileType = file.type;
    this.fileSize = file.size;

    this.onProgress = onProgress;
  }

  async uploadFile() {
    await this.createUploadJob();
    await this.uploadParts();
    await this.finishUpload();
  }

  private async createUploadJob() {
    const res = await ApiService.post<InitiateUploadResponse>(`${endpoint}/initiateUpload`, {
      fileName: this.fileName,
      fileSize: this.fileSize,
    });

    this.urls = res.data.urls;
    this.partSize = res.data.partSize;
    this.uploadId = res.data.uploadId;
    this.fileId = res.data.fileId;
  }

  private async uploadParts() {
    const axiosInstance = axios.create();
    // investigate if this is necessary and why
    // https://stackoverflow.com/questions/36301483/what-does-amazon-s3-use-the-content-type-header-for
    // delete axiosInstance.defaults.headers.put['Content-Type'];

    const totalParts = this.getTotalNumberOfParts();

    for (let pIndex = 0; pIndex < totalParts; pIndex++) {
      await this.uploadSinglePart(pIndex, axiosInstance);
      this.updateExternalProgress(pIndex, totalParts);
    }
  }

  private getTotalNumberOfParts() {
    return Math.ceil(this.fileSize / this.partSize);
  }

  private async uploadSinglePart(pIndex: number, axiosInstance: AxiosInstance) {
    const reader = new FileReader();
    const blob = this.file.slice(pIndex * this.partSize, (pIndex + 1) * this.partSize);

    reader.readAsArrayBuffer(blob);

    const res = await new Promise<AxiosResponse<any, any>>((resolve, reject) => {
      reader.onload = async e => {
        try {
          if (!e.target?.result || !(e.target.result instanceof ArrayBuffer))
            throw new Error('Could not read file');

          const part = e.target.result;
          const res = await axiosInstance.put(this.urls[pIndex], part);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      };
    });

    this.etags.push(res.headers.etag);
  }

  private async updateExternalProgress(pIndex: number, totalParts: number) {
    this.onProgress((pIndex + 1) / totalParts);
  }

  private finishUpload() {
    return ApiService.post(`${endpoint}/finishUpload`, {
      etags: this.etags,
      fileId: this.fileId,
      uploadId: this.uploadId,
    });
  }
}

class FileDownloader {
  private fileId: string;

  constructor(fileId: string) {
    this.fileId = fileId;
  }

  async download() {
    const url = await this.getDownloadUrl();

    FileDownloader.clickDownloadLink(url);
  }

  private async getDownloadUrl() {
    const res = await ApiService.get<{ url: string }>(`${endpoint}/${this.fileId}/download`);

    return res.data.url;
  }

  private static clickDownloadLink(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('type', 'hidden');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// console.time('upload');
// console.time('read file');

// console.log(this.fileType);

// console.timeEnd('read file');
// console.timeEnd('upload');

export default FilesService;
