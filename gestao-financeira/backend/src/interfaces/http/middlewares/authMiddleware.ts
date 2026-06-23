import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../application/ports/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/DomainError';

/** Estende Request com o usuario autenticado. */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Middleware de autenticacao JWT. Driving adapter.
 * Recebe o ITokenService por injecao (factory).
 */
export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de autenticacao ausente.');
    }
    const token = header.substring(7);
    const payload = tokenService.verify(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  };
}
