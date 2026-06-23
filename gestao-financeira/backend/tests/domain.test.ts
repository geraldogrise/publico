import { Transaction } from '../src/domain/entities/Transaction';
import { Money } from '../src/domain/value-objects/Money';
import { Email } from '../src/domain/value-objects/Email';
import { ValidationError } from '../src/domain/errors/DomainError';

describe('Dominio - regras de negocio', () => {
  it('Money deve somar sem erro de ponto flutuante', () => {
    const a = Money.fromNumber(0.1);
    const b = Money.fromNumber(0.2);
    expect(a.add(b).value).toBe(0.3);
  });

  it('Email deve normalizar e validar', () => {
    expect(Email.create('  ADMIN@Demo.com ').value).toBe('admin@demo.com');
    expect(() => Email.create('invalido')).toThrow(ValidationError);
  });

  it('Transaction de despesa deve ter signedAmount negativo', () => {
    const tx = Transaction.create({
      id: '1',
      description: 'Teste',
      amount: 100,
      type: 'EXPENSE',
      userId: 'u1',
      accountId: 'a1',
      categoryId: 'c1',
    });
    expect(tx.signedAmount).toBe(-100);
  });

  it('Transaction deve rejeitar valor nao positivo', () => {
    expect(() =>
      Transaction.create({
        id: '1',
        description: 'Teste',
        amount: 0,
        type: 'EXPENSE',
        userId: 'u1',
        accountId: 'a1',
        categoryId: 'c1',
      }),
    ).toThrow(ValidationError);
  });
});
