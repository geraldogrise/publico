import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/ports/ITokenService';
import { UnauthorizedError } from '../../domain/errors/DomainError';

/** Adapter de JWT com jsonwebtoken. */
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = '1d',
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;
      return { sub: String(decoded.sub), email: String(decoded.email) };
    } catch {
      throw new UnauthorizedError('Token invalido ou expirado.');
    }
  }
}
