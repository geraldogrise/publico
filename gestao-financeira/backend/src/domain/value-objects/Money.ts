import { ValidationError } from '../errors/DomainError';

/**
 * Value Object Money. Imutavel. Representa um valor monetario em centavos
 * internamente para evitar erros de ponto flutuante, mas exposto como numero.
 */
export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    this.cents = cents;
  }

  static fromNumber(value: number): Money {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new ValidationError('Valor monetario invalido.');
    }
    return new Money(Math.round(value * 100));
  }

  get value(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }
}
