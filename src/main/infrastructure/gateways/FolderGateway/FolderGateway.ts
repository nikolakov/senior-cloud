import Folder from '../../../domain/entities/Folder';

interface FolderGateway {
  create(folder: Folder): Promise<Folder>;

  findById(id: string): Promise<Folder | undefined>;

  update(folder: Folder): Promise<Folder>;

  delete(id: string): Promise<boolean>;

  findRootByOwner(ownerId: string): Promise<Folder | undefined>;

  findChildrenByParent(folderId: string): Promise<Folder[]>;
}

export default FolderGateway;
