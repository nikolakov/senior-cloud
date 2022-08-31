import { FileFromApi, JobFromApi } from 'types';
import ApiService from './ApiService';
import { createQueryParams } from './utils';

const endpoint = '/files';

const FilesService = {
  upload: async (
    files: FileList,
    onProgress: (progress: number, filesUploaded: number) => void,
    onFileUpload: () => void
  ) => {
    let filesUploaded = 0;

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      console.log('files: ', files);
      const file = files[fileIndex];
      console.log('file: ', file);
      const fileName = file.name;
      const fileReader = new FileReader();

      // eslint-disable-next-line no-loop-func
      await new Promise<void>((resolve, reject) => {
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = async e => {
          try {
            console.log('File read successfully');

            if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
              throw new Error('Could not read file');
            }

            const content = e.target.result;

            const jobRes = await ApiService.post<JobFromApi>(`${endpoint}/createUploadJob`, {
              fileName,
              fileSize: content.byteLength,
            });

            const { jobId, chunkSize } = jobRes.data;
            const totalChunks = Math.ceil(content.byteLength / chunkSize);

            for (let cIndex = 0; cIndex < totalChunks; cIndex++) {
              let CHUNK = content.slice(cIndex * chunkSize, (cIndex + 1) * chunkSize);

              await ApiService.post(`${endpoint}/upload${createQueryParams({ jobId })}`, CHUNK, {
                headers: {
                  'content-type': 'application/octet-stream',
                },
                timeout: 30000,
              });

              onProgress(
                Math.ceil(1 + ((filesUploaded + (cIndex + 1) / totalChunks) / files.length) * 100),
                filesUploaded
              );
              if (cIndex + 1 === totalChunks) {
                resolve();
              }
            }
          } catch (e) {
            reject(e);
          }
        };
      });
      onFileUpload();
      filesUploaded += 1;
    }
  },
  getFiles: () => ApiService.get<FileFromApi[]>(`${endpoint}`),
  delete: (fileId: string) => ApiService.delete(`${endpoint}/${fileId}`),
};

export default FilesService;
