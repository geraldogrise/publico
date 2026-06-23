import { PrismaClient } from '@prisma/client';

import { PrismaUserRepository } from '../src/infrastructure/persistence/repositories/PrismaUserRepository';
import { PrismaAccountRepository } from '../src/infrastructure/persistence/repositories/PrismaAccountRepository';
import { PrismaCategoryRepository } from '../src/infrastructure/persistence/repositories/PrismaCategoryRepository';
import { PrismaTransactionRepository } from '../src/infrastructure/persistence/repositories/PrismaTransactionRepository';
import { PrismaBudgetRepository } from '../src/infrastructure/persistence/repositories/PrismaBudgetRepository';
import { PrismaGoalRepository } from '../src/infrastructure/persistence/repositories/PrismaGoalRepository';
import { PrismaSummaryRepository } from '../src/infrastructure/persistence/repositories/PrismaSummaryRepository';

import { User } from '../src/domain/entities/User';
import { Account } from '../src/domain/entities/Account';
import { Category } from '../src/domain/entities/Category';
import { Transaction } from '../src/domain/entities/Transaction';
import { Budget } from '../src/domain/entities/Budget';
import { Goal } from '../src/domain/entities/Goal';

/**
 * Testes dos adapters Prisma (camada de Infraestrutura) usando um PrismaClient
 * fake. Garante que cada repositorio chama o Prisma corretamente e mapeia o
 * resultado de volta para a entidade de dominio (toDomain).
 */

const D = new Date('2024-01-15T10:00:00.000Z');

function fakePrisma(overrides: Record<string, unknown> = {}): PrismaClient {
  const base = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    account: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    category: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    transaction: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    tagsOnTransactions: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    budget: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    goal: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  } as Record<string, unknown>;
  Object.assign(base, overrides);
  // $transaction executa o callback passando o proprio client fake como tx.
  (base as { $transaction: unknown }).$transaction = jest.fn(
    async (cb: (tx: unknown) => unknown) => cb(base),
  );
  return base as unknown as PrismaClient;
}

describe('PrismaUserRepository', () => {
  const userRow = {
    id: 'u1',
    name: 'Usuario Teste',
    email: 'user@demo.com',
    password: 'hashed-pass-123',
    createdAt: D,
    updatedAt: D,
  };

  it('findById mapeia para entidade', async () => {
    const prisma = fakePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userRow);
    const repo = new PrismaUserRepository(prisma);
    const user = await repo.findById('u1');
    expect(user?.id).toBe('u1');
    expect(user?.email.value).toBe('user@demo.com');
  });

  it('findById retorna null quando nao existe', async () => {
    const prisma = fakePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaUserRepository(prisma);
    expect(await repo.findById('x')).toBeNull();
  });

  it('findByEmail normaliza e mapeia', async () => {
    const prisma = fakePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userRow);
    const repo = new PrismaUserRepository(prisma);
    const user = await repo.findByEmail('USER@demo.com');
    expect(user?.id).toBe('u1');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@demo.com' },
    });
  });

  it('create persiste e mapeia', async () => {
    const prisma = fakePrisma();
    (prisma.user.create as jest.Mock).mockResolvedValue(userRow);
    const repo = new PrismaUserRepository(prisma);
    const entity = User.create({ id: 'u1', name: 'Usuario Teste', email: 'user@demo.com', password: 'hashed-pass-123' });
    const saved = await repo.create(entity);
    expect(saved.id).toBe('u1');
    expect(prisma.user.create).toHaveBeenCalled();
  });
});

describe('PrismaAccountRepository', () => {
  const row = { id: 'a1', name: 'Carteira', type: 'WALLET', initialBalance: 100, userId: 'u1', createdAt: D, updatedAt: D };
  const entity = Account.create({ id: 'a1', name: 'Carteira', type: 'WALLET', initialBalance: 100, userId: 'u1' });

  it('cobre CRUD completo', async () => {
    const prisma = fakePrisma();
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(row);
    (prisma.account.findMany as jest.Mock).mockResolvedValue([row]);
    (prisma.account.create as jest.Mock).mockResolvedValue(row);
    (prisma.account.update as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaAccountRepository(prisma);

    expect((await repo.findById('a1', 'u1'))?.name).toBe('Carteira');
    expect((await repo.findAllByUser('u1')).length).toBe(1);
    expect((await repo.create(entity)).id).toBe('a1');
    expect((await repo.update(entity)).type).toBe('WALLET');
    await repo.delete('a1', 'u1');
    expect(prisma.account.deleteMany).toHaveBeenCalledWith({ where: { id: 'a1', userId: 'u1' } });
  });

  it('findById retorna null', async () => {
    const prisma = fakePrisma();
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaAccountRepository(prisma);
    expect(await repo.findById('a1', 'u1')).toBeNull();
  });
});

describe('PrismaCategoryRepository', () => {
  const row = { id: 'c1', name: 'Mercado', type: 'EXPENSE', color: '#f00', icon: null, userId: 'u1', createdAt: D, updatedAt: D };
  const entity = Category.create({ id: 'c1', name: 'Mercado', type: 'EXPENSE', color: '#f00', icon: null, userId: 'u1' });

  it('cobre CRUD completo', async () => {
    const prisma = fakePrisma();
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(row);
    (prisma.category.findMany as jest.Mock).mockResolvedValue([row]);
    (prisma.category.create as jest.Mock).mockResolvedValue(row);
    (prisma.category.update as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaCategoryRepository(prisma);

    expect((await repo.findById('c1', 'u1'))?.name).toBe('Mercado');
    expect((await repo.findAllByUser('u1')).length).toBe(1);
    expect((await repo.create(entity)).id).toBe('c1');
    expect((await repo.update(entity)).type).toBe('EXPENSE');
    await repo.delete('c1', 'u1');
    expect(prisma.category.deleteMany).toHaveBeenCalled();
  });

  it('findById retorna null', async () => {
    const prisma = fakePrisma();
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaCategoryRepository(prisma);
    expect(await repo.findById('c1', 'u1')).toBeNull();
  });
});

describe('PrismaTransactionRepository', () => {
  const row = {
    id: 't1', description: 'Compra', amount: 50, type: 'EXPENSE', date: D,
    userId: 'u1', accountId: 'a1', categoryId: 'c1', createdAt: D, updatedAt: D,
    tags: [{ tagId: 'tag1' }],
  };
  const entity = Transaction.create({
    id: 't1', description: 'Compra', amount: 50, type: 'EXPENSE', date: D,
    userId: 'u1', accountId: 'a1', categoryId: 'c1', tagIds: ['tag1'],
  });

  it('findById mapeia tags', async () => {
    const prisma = fakePrisma();
    (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaTransactionRepository(prisma);
    const tx = await repo.findById('t1', 'u1');
    expect(tx?.tagIds).toEqual(['tag1']);
  });

  it('findById retorna null', async () => {
    const prisma = fakePrisma();
    (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaTransactionRepository(prisma);
    expect(await repo.findById('t1', 'u1')).toBeNull();
  });

  it('findAllByUser aplica todos os filtros', async () => {
    const prisma = fakePrisma();
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([row]);
    const repo = new PrismaTransactionRepository(prisma);
    const list = await repo.findAllByUser('u1', {
      accountId: 'a1', categoryId: 'c1', type: 'EXPENSE', from: D, to: D,
    });
    expect(list.length).toBe(1);
    const arg = (prisma.transaction.findMany as jest.Mock).mock.calls[0][0];
    expect(arg.where.accountId).toBe('a1');
    expect(arg.where.date.gte).toBe(D);
    expect(arg.where.date.lte).toBe(D);
  });

  it('create persiste com tags', async () => {
    const prisma = fakePrisma();
    (prisma.transaction.create as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaTransactionRepository(prisma);
    expect((await repo.create(entity)).id).toBe('t1');
  });

  it('update usa $transaction e recria tags', async () => {
    const prisma = fakePrisma();
    (prisma.transaction.update as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaTransactionRepository(prisma);
    const updated = await repo.update(entity);
    expect(updated.id).toBe('t1');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.tagsOnTransactions.deleteMany).toHaveBeenCalledWith({
      where: { transactionId: 't1' },
    });
  });

  it('delete chama deleteMany', async () => {
    const prisma = fakePrisma();
    const repo = new PrismaTransactionRepository(prisma);
    await repo.delete('t1', 'u1');
    expect(prisma.transaction.deleteMany).toHaveBeenCalled();
  });
});

describe('PrismaBudgetRepository', () => {
  const row = { id: 'b1', amount: 500, month: 1, year: 2024, userId: 'u1', categoryId: 'c1', createdAt: D, updatedAt: D };
  const entity = Budget.create({ id: 'b1', amount: 500, month: 1, year: 2024, userId: 'u1', categoryId: 'c1' });

  it('cobre CRUD completo', async () => {
    const prisma = fakePrisma();
    (prisma.budget.findFirst as jest.Mock).mockResolvedValue(row);
    (prisma.budget.findMany as jest.Mock).mockResolvedValue([row]);
    (prisma.budget.create as jest.Mock).mockResolvedValue(row);
    (prisma.budget.update as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaBudgetRepository(prisma);

    expect((await repo.findById('b1', 'u1'))?.amount).toBe(500);
    expect((await repo.findAllByUser('u1')).length).toBe(1);
    expect((await repo.create(entity)).id).toBe('b1');
    expect((await repo.update(entity)).month).toBe(1);
    await repo.delete('b1', 'u1');
    expect(prisma.budget.deleteMany).toHaveBeenCalled();
  });

  it('findById retorna null', async () => {
    const prisma = fakePrisma();
    (prisma.budget.findFirst as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaBudgetRepository(prisma);
    expect(await repo.findById('b1', 'u1')).toBeNull();
  });
});

describe('PrismaGoalRepository', () => {
  const row = { id: 'g1', name: 'Reserva', targetAmount: 1000, currentAmount: 100, deadline: null, userId: 'u1', createdAt: D, updatedAt: D };
  const entity = Goal.create({ id: 'g1', name: 'Reserva', targetAmount: 1000, currentAmount: 100, deadline: null, userId: 'u1' });

  it('cobre CRUD completo', async () => {
    const prisma = fakePrisma();
    (prisma.goal.findFirst as jest.Mock).mockResolvedValue(row);
    (prisma.goal.findMany as jest.Mock).mockResolvedValue([row]);
    (prisma.goal.create as jest.Mock).mockResolvedValue(row);
    (prisma.goal.update as jest.Mock).mockResolvedValue(row);
    const repo = new PrismaGoalRepository(prisma);

    expect((await repo.findById('g1', 'u1'))?.name).toBe('Reserva');
    expect((await repo.findAllByUser('u1')).length).toBe(1);
    expect((await repo.create(entity)).id).toBe('g1');
    expect((await repo.update(entity)).targetAmount).toBe(1000);
    await repo.delete('g1', 'u1');
    expect(prisma.goal.deleteMany).toHaveBeenCalled();
  });

  it('findById retorna null', async () => {
    const prisma = fakePrisma();
    (prisma.goal.findFirst as jest.Mock).mockResolvedValue(null);
    const repo = new PrismaGoalRepository(prisma);
    expect(await repo.findById('g1', 'u1')).toBeNull();
  });
});

describe('PrismaSummaryRepository', () => {
  it('agrega receitas, despesas e gastos por categoria (com filtro de datas)', async () => {
    const accounts = [{ initialBalance: 100 }, { initialBalance: 50 }];
    const txs = [
      { type: 'INCOME', amount: 200, categoryId: 'c1', category: { name: 'Salario', color: '#0f0' } },
      { type: 'EXPENSE', amount: 50, categoryId: 'c2', category: { name: 'Comida', color: '#f00' } },
      { type: 'EXPENSE', amount: 30, categoryId: 'c2', category: { name: 'Comida', color: '#f00' } },
      { type: 'EXPENSE', amount: 10, categoryId: 'c3', category: null },
    ];
    const prisma = fakePrisma();
    (prisma.account.findMany as jest.Mock).mockResolvedValue(accounts);
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(txs);
    const repo = new PrismaSummaryRepository(prisma);

    const summary = await repo.getSummary('u1', new Date('2024-01-01'), new Date('2024-12-31'));
    expect(summary.totalIncome).toBe(200);
    expect(summary.totalExpense).toBe(90);
    expect(summary.balance).toBe(260); // 150 + 200 - 90
    expect(summary.transactionCount).toBe(4);
    // c2 agregado (80) deve vir antes de c3 (10); categoria nula -> 'Sem categoria'
    expect(summary.spendingByCategory[0]).toMatchObject({ categoryId: 'c2', total: 80 });
    const semCat = summary.spendingByCategory.find((c) => c.categoryId === 'c3');
    expect(semCat?.categoryName).toBe('Sem categoria');
  });

  it('sem filtro de datas tambem funciona', async () => {
    const prisma = fakePrisma();
    (prisma.account.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
    const repo = new PrismaSummaryRepository(prisma);
    const summary = await repo.getSummary('u1');
    expect(summary.balance).toBe(0);
    expect(summary.spendingByCategory).toEqual([]);
  });
});
