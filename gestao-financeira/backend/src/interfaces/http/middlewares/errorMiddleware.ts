import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DomainError } from '../../../domain/errors/DomainError';

/** Middleware central de tratamento de erros. Traduz erros -> HTTP. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Dados invalidos.',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  // Erros do Prisma (constraints unicas etc.)
  const anyErr = err as { code?: string; message?: string };
  if (anyErr?.code === 'P2002') {
    res.status(409).json({
      error: 'ConflictError',
      message: 'Registro duplicado (violacao de unicidade).',
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('[ERRO NAO TRATADO]', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Erro interno do servidor.',
  });
}
