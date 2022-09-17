import { FileFromApi, JobFromApi, TempJWTResponseDTO } from 'types';
import ApiService from './ApiService';
import { createQueryParams } from './utils';

const endpoint = '/files';

const FilesService = {
  async createUploadJob(fileName: string, fileSize: number) {
    const res = await ApiService.post<JobFromApi>(`${endpoint}/createUploadJob`, {
      fileName,
      fileSize,
    });

    return res.data;
  },
  async uploadBatch(chunk: ArrayBuffer, jobId: string) {
    await ApiService.post(`${endpoint}/upload${createQueryParams({ jobId })}`, chunk, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      timeout: 3000,
    });
  },
  async uploadFile(file: File, onProgress: (fileProgress: number) => void) {
    const fileName = file.name;
    const fileReader = new FileReader();

    await new Promise<void>((resolve, reject) => {
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async e => {
        try {
          if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
            throw new Error('Could not read file');
          }

          const content = e.target.result;

          const { jobId, chunkSize } = await this.createUploadJob(fileName, content.byteLength);
          const totalChunks = Math.ceil(content.byteLength / chunkSize);

          for (let cIndex = 0; cIndex < totalChunks; cIndex++) {
            let CHUNK = content.slice(cIndex * chunkSize, (cIndex + 1) * chunkSize);

            await this.uploadBatch(CHUNK, jobId);

            onProgress((cIndex + 1) / totalChunks);
            if (cIndex + 1 === totalChunks) {
              resolve();
            }
          }
        } catch (e) {
          reject(e);
        }
      };
    });
  },
  getFiles: () => ApiService.get<FileFromApi[]>(`${endpoint}`),
  getTempJWT() {
    return ApiService.get<TempJWTResponseDTO>(`${endpoint}/tempJWT`);
  },
  async download(userId: string, fileId: string) {
    const res = await this.getTempJWT();

    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = `/api/${endpoint}/${userId}/${fileId}/download${createQueryParams({
      token: res.data.token,
    })}`;
    link.setAttribute('type', 'hidden');
    link.click();
  },
  delete: (fileId: string) => ApiService.delete(`${endpoint}/${fileId}`),
};

export default FilesService;
