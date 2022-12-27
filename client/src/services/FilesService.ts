import axios, { AxiosInstance } from 'axios';
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
  private onProgress: (fileProgress: number) => void;

  private buffer: ArrayBuffer = new ArrayBuffer(0);
  private urls: string[] = [];
  private partSize: number = 0;
  private UploadId: string = '';
  private fileId: string = '';
  private etags: string[] = [];

  constructor(file: File, onProgress: (fileProgress: number) => void) {
    this.file = file;
    this.fileName = file.name;
    this.fileType = file.type;

    this.onProgress = onProgress;
  }

  async uploadFile() {
    await this.readFile();
    await this.createUploadJob();
    await this.uploadParts();
    await this.finishUpload();
  }

  private async readFile() {
    const fileReader = new FileReader();

    this.buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      fileReader.readAsArrayBuffer(this.file);

      fileReader.onload = async e => {
        try {
          if (!e.target?.result || !(e.target.result instanceof ArrayBuffer))
            throw new Error('Could not read file');

          const buffer = e.target.result;
          resolve(buffer);
        } catch (e) {
          reject(e);
        }
      };
    });
  }

  private async createUploadJob() {
    const res = await ApiService.post<InitiateUploadResponse>(`${endpoint}/initiateUpload`, {
      fileName: this.fileName,
      fileSize: this.buffer.byteLength,
    });

    this.urls = res.data.urls;
    this.partSize = res.data.partSize;
    this.UploadId = res.data.UploadId;
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
    return Math.ceil(this.buffer.byteLength / this.partSize);
  }

  private async uploadSinglePart(pIndex: number, axiosInstance: AxiosInstance) {
    let part = this.buffer.slice(pIndex * this.partSize, (pIndex + 1) * this.partSize);

    const res = await axiosInstance.put(this.urls[pIndex], part);
    this.etags.push(res.headers.etag);
  }

  private async updateExternalProgress(pIndex: number, totalParts: number) {
    this.onProgress((pIndex + 1) / totalParts);
  }

  private finishUpload() {
    return ApiService.post(`${endpoint}/finishUpload`, {
      etags: this.etags,
      fileId: this.fileId,
      UploadId: this.UploadId,
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
