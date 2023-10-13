export type FolderBoundaryDTO = {
  id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FolderGatewayDTO = {
  id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  createdAt: Date;
  updatedAt: Date;
};

type FolderToGatewayDTO = Omit<FolderGatewayDTO, 'id' | 'createdAt' | 'updatedAt'>;

class Folder {
  id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.name = '';
    this.owner = '';
    this.parentFolder = undefined;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  fromGatewayDTO(dto: FolderGatewayDTO): void {
    this.id = dto.id;
    this.name = dto.name;
    this.owner = dto.owner;
    this.parentFolder = dto.parentFolder;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }

  toGatewayDTO(): FolderToGatewayDTO {
    return {
      name: this.name,
      owner: this.owner,
      parentFolder: this.parentFolder,
    };
  }

  toBoundaryDTO(): FolderBoundaryDTO {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      parentFolder: this.parentFolder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Folder;
