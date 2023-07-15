import File from '../../../domain/entities/File';

interface FileGateway {
  create(file: File): Promise<File>;

  findById(id: string): Promise<File | undefined>;

  update(file: File): Promise<File>;

  delete(id: string): Promise<boolean>;

  findAllByOwner(ownerId: string): Promise<File[]>;

  findAllInFolder(folderId: string): Promise<File[]>;
}

export default FileGateway;
