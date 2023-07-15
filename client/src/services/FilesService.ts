import axios, { AxiosInstance } from 'axios';
import { FileFromApi, InitiateUploadResponse } from 'types';
import ApiService from './ApiService';

const endpoint = '/files';

export type FileProgress = {
  totalParts: number;
  uploaded: number;
};

class FilesService {
  static async uploadFile(file: File, onProgress: (totalParts: number) => void) {
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
  private onProgress: (totalParts: number) => void;

  private urls: string[] = [];
  private partSize: number = 0;
  private uploadId: string = '';
  private fileId: string = '';
  private etags: string[] = [];
  private totalParts: number = 1;

  constructor(file: File, onProgress: (totalParts: number) => void) {
    this.file = file;
    this.fileName = file.name;
    this.fileType = file.type;
    this.fileSize = file.size;

    this.onProgress = onProgress;
  }

  async uploadFile() {
    await this.initiateUpload();
    console.time('upload time');
    await this.uploadPartsSync();
    console.timeEnd('upload time');
    await this.finishUpload();
  }

  private async initiateUpload() {
    const res = await ApiService.post<InitiateUploadResponse>(`${endpoint}/initiateUpload`, {
      fileName: this.fileName,
      fileSize: this.fileSize,
    });

    this.urls = res.data.urls;
    this.partSize = res.data.partSize;
    this.uploadId = res.data.uploadId;
    this.fileId = res.data.fileId;
  }

  private async uploadPartsSync() {
    const axiosInstance = axios.create();
    this.totalParts = this.getTotalNumberOfParts();

    for (let pIndex = 0; pIndex < this.totalParts; pIndex++) {
      await this.uploadSinglePart(pIndex, axiosInstance);
    }
  }

  private getTotalNumberOfParts() {
    return Math.ceil(this.fileSize / this.partSize);
  }

  private async uploadSinglePart(pIndex: number, axiosInstance: AxiosInstance) {
    const part = await this.readPart(pIndex);
    const res = await axiosInstance.put(this.urls[pIndex], part);

    this.updateExternalProgress();
    this.etags.push(res.headers.etag);
  }

  private readPart(pIndex: number): Promise<ArrayBuffer> {
    const blob = this.file.slice(pIndex * this.partSize, (pIndex + 1) * this.partSize);
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    return new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = async e => {
        try {
          if (!e.target?.result || !(e.target.result instanceof ArrayBuffer))
            throw new Error('Could not read file');
          resolve(e.target.result);
        } catch (e) {
          reject(e);
        }
      };
    });
  }

  private async updateExternalProgress() {
    this.onProgress(this.totalParts);
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

export default FilesService;
