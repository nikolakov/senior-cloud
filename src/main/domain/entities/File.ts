export type FileBoundaryDTO = {
  id: string;
  name: string;
  owner: string;
  fileSize: number;
  createdAt: number;
  modifiedAt: number;
};

export type FileGatewayDTO = {
  id: string;
  name: string;
  owner: string;
  fileSize: number;
  uploaded: boolean;
  createdAt: number;
  modifiedAt: number;
};

type FileToGatewayDTO = Omit<FileGatewayDTO, 'id'>;

class File {
  id: string;
  name: string;
  owner: string;
  fileSize: number;
  uploaded: boolean;
  createdAt: Date;
  modifiedAt: Date;

  constructor() {
    this.id = '';
    this.name = '';
    this.owner = '';
    this.fileSize = 0;
    this.uploaded = false;
    this.createdAt = new Date();
    this.modifiedAt = new Date();
  }

  fromGatewayDTO(dto: FileGatewayDTO): void {
    this.id = dto.id;
    this.name = dto.name;
    this.owner = dto.owner;
    this.fileSize = dto.fileSize;
    this.uploaded = dto.uploaded;
    this.createdAt = new Date(dto.createdAt);
    this.modifiedAt = new Date(dto.modifiedAt);
  }

  toGatewayDTO(): FileToGatewayDTO {
    return {
      name: this.name,
      owner: this.owner,
      fileSize: this.fileSize,
      uploaded: this.uploaded,
      createdAt: this.createdAt.getTime(),
      modifiedAt: this.modifiedAt.getTime(),
    };
  }

  toBoundaryDTO(): FileBoundaryDTO {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      fileSize: this.fileSize,
      createdAt: this.createdAt.getTime(),
      modifiedAt: this.modifiedAt.getTime(),
    };
  }
}

export default File;
