export type FileBoundaryDTO = {
  id: string;
  name: string;
  owner: string;
  folder: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FileGatewayDTO = {
  id: string;
  name: string;
  owner: string;
  folder: string;
  fileSize: number;
  uploaded: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FileToGatewayDTO = Omit<FileGatewayDTO, 'id'>;

class File {
  id: string;
  name: string;
  owner: string;
  folder: string;
  fileSize: number;
  uploaded: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.name = '';
    this.owner = '';
    this.folder = '';
    this.fileSize = 0;
    this.uploaded = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  fromGatewayDTO(dto: FileGatewayDTO): void {
    this.id = dto.id;
    this.name = dto.name;
    this.owner = dto.owner;
    this.folder = dto.folder;
    this.fileSize = dto.fileSize;
    this.uploaded = dto.uploaded;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }

  toGatewayDTO(): FileToGatewayDTO {
    return {
      name: this.name,
      owner: this.owner,
      folder: this.folder,
      fileSize: this.fileSize,
      uploaded: this.uploaded,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toBoundaryDTO(): FileBoundaryDTO {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      folder: this.folder,
      fileSize: this.fileSize,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default File;
