import axios, { AxiosInstance } from 'axios';
import { FileFromApi, JobFromApiv2 } from 'types';
import ApiService from './ApiService';

const endpoint = '/files';

const FilesService = {
  async createUploadJob(fileName: string, fileSize: number) {
    const res = await ApiService.post<JobFromApiv2>(`${endpoint}/initiateUpload`, {
      fileName,
      fileSize,
    });

    return res.data;
  },
  async uploadBatch(part: ArrayBuffer, url: string, axiosInstance: AxiosInstance) {
    const res = await axiosInstance.put(url, part);

    console.log('headers:', res.headers);

    return {
      etag: res.headers.etag,
    };
  },
  async finishUpload(etags: string[], fileId: string, UploadId: string) {
    const res = await ApiService.post(`${endpoint}/finishUpload`, { etags, fileId, UploadId });

    return res.data;
  },
  async uploadFile(file: File, onProgress: (fileProgress: number) => void) {
    console.time('upload');
    console.time('read file');
    const fileName = file.name;
    const fileType = file.type;
    console.log(fileType);
    const fileReader = new FileReader();

    const { urls, partSize, UploadId, fileId, buffer } = await new Promise<
      JobFromApiv2 & { buffer: ArrayBuffer }
    >((resolve, reject) => {
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async e => {
        try {
          if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
            throw new Error('Could not read file');
          }

          const buffer = e.target.result;

          const res = await this.createUploadJob(fileName, buffer.byteLength);

          console.timeEnd('read file');
          resolve({ ...res, buffer });
        } catch (e) {
          reject(e);
        }
      };
    });

    const axiosInstance = axios.create();
    // investigate if this is necessary and why
    // https://stackoverflow.com/questions/36301483/what-does-amazon-s3-use-the-content-type-header-for
    // delete axiosInstance.defaults.headers.put['Content-Type'];

    const totalParts = Math.ceil(buffer.byteLength / partSize);

    const etags = [];

    for (let pIndex = 0; pIndex < totalParts; pIndex++) {
      let part = buffer.slice(pIndex * partSize, (pIndex + 1) * partSize);

      const { etag } = await this.uploadBatch(part, urls[pIndex], axiosInstance);

      etags.push(etag);

      onProgress((pIndex + 1) / totalParts);
    }

    console.log(etags, fileId, UploadId);

    const finishRes = await this.finishUpload(etags, fileId, UploadId);

    console.timeEnd('upload');
    console.log(finishRes);
  },
  getFiles: () => ApiService.get<FileFromApi[]>(`${endpoint}`),
  getDownloadUrl: async (fileId: string) => {
    const res = await ApiService.get<{ url: string }>(`${endpoint}/${fileId}/download`);

    return res.data.url;
  },
  async download(fileId: string) {
    const url = await this.getDownloadUrl(fileId);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('type', 'hidden');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  delete: (fileId: string) => ApiService.delete(`${endpoint}/${fileId}`),
};

export default FilesService;
