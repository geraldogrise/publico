import { ValidationError } from '../errors/DomainError';

/**
 * Value Object Email. Imutavel e auto-validado.
 */
export class Email {
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    const normalized = (value ?? '').trim().toLowerCase();
    if (!Email.REGEX.test(normalized)) {
      throw new ValidationError('E-mail invalido.');
    }
    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
