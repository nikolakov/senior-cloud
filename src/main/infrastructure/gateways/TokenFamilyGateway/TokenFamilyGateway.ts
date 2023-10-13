import TokenFamily from '../../../domain/entities/TokenFamily';

interface TokenFamilyGateway {
  create(tokenFamily: TokenFamily): Promise<TokenFamily>;

  findById(id: string): Promise<TokenFamily | undefined>;

  update(folder: TokenFamily): Promise<TokenFamily>;

  delete(id: string): Promise<boolean>;
}

export default TokenFamilyGateway;
