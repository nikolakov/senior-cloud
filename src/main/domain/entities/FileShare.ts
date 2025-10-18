export type FileShareBoundaryDTO = {
  id: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FileShareGatewayDTO = {
  id: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
};

type FileShareToGatewayDTO = Omit<FileShareGatewayDTO, 'id' | 'createdAt' | 'updatedAt'>;

class FileShare {
  id: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.fileId = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  fromGatewayDTO(dto: FileShareGatewayDTO): void {
    this.id = dto.id;
    this.fileId = dto.fileId;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }

  toGatewayDTO(): FileShareToGatewayDTO {
    return { fileId: this.fileId };
  }

  toBoundaryDTO(): FileShareBoundaryDTO {
    return {
      id: this.id,
      fileId: this.fileId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default FileShare;
