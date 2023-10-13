export type TokenFamilyBoundaryDTO = {
  id: string;
  userId: string;
  index: number;
  invalidated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TokenFamilyGatewayDTO = {
  id: string;
  userId: string;
  index: number;
  invalidated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TokenFamilyToGatewayDTO = Omit<TokenFamilyGatewayDTO, 'id' | 'createdAt' | 'updatedAt'>;

class TokenFamily {
  id: string;
  userId: string;
  index: number;
  invalidated: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.userId = '';
    this.index = 0;
    this.invalidated = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  fromGatewayDTO(dto: TokenFamilyGatewayDTO): void {
    this.id = dto.id;
    this.userId = dto.userId;
    this.index = dto.index;
    this.invalidated = dto.invalidated;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
  }

  toGatewayDTO(): TokenFamilyToGatewayDTO {
    return {
      userId: this.userId,
      index: this.index,
      invalidated: this.invalidated,
    };
  }

  toBoundaryDTO(): TokenFamilyBoundaryDTO {
    return {
      id: this.id,
      userId: this.userId,
      index: this.index,
      invalidated: this.invalidated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default TokenFamily;
