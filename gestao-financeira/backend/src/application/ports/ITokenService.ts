export interface TokenPayload {
  sub: string;
  email: string;
}

/** Port para emissao/verificacao de JWT (implementado com jsonwebtoken). */
export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
