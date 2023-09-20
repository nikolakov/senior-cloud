import ApiService from './ApiService';
import { FileFromApi, FolderFromApi } from 'types';

const endpoint = '/folders';

class FoldersService {
  static getFolderFiles(folderId: string) {
    return ApiService.get<FileFromApi[]>(`${endpoint}/${folderId}/files`);
  }

  static createFolder(name: string, parentFolderId: string) {
    return ApiService.post<FolderFromApi>(`${endpoint}`, {
      name,
      parentFolderId,
    });
  }

  static deleteFolder(folderId: string) {
    return ApiService.delete(`
    ${endpoint}/${folderId}`);
  }
}

export default FoldersService;
