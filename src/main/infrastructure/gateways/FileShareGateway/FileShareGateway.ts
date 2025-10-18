import FileShare from '../../../domain/entities/FileShare';

interface FileShareGateway {
  create(fileShare: FileShare): Promise<FileShare>;

  findById(id: string): Promise<FileShare | undefined>;

  update(file: FileShare): Promise<FileShare>;

  delete(id: string): Promise<boolean>;
}

export default FileShareGateway;
