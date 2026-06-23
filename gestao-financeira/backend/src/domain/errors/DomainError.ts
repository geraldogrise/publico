/**
 * Erros de dominio. Camada pura, sem dependencia de framework.
 * Sao traduzidos para HTTP no error middleware.
 */
export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  readonly statusCode = 400;
}

export class NotFoundError extends DomainError {
  readonly statusCode = 404;
}

export class UnauthorizedError extends DomainError {
  readonly statusCode = 401;
}

export class ConflictError extends DomainError {
  readonly statusCode = 409;
}
