import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Envolve handlers async/sync e encaminha erros para o errorMiddleware.
 * Evita try/catch repetitivo nos controllers (DRY).
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
