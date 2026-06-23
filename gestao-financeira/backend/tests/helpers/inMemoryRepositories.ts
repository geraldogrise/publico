import { IUserRepository } from '../../src/domain/repositories/IUserRepository';
import { IAccountRepository } from '../../src/domain/repositories/IAccountRepository';
import { ICategoryRepository } from '../../src/domain/repositories/ICategoryRepository';
import {
  ITransactionRepository,
  TransactionFilter,
} from '../../src/domain/repositories/ITransactionRepository';
import { IBudgetRepository } from '../../src/domain/repositories/IBudgetRepository';
import { IGoalRepository } from '../../src/domain/repositories/IGoalRepository';
import {
  ISummaryRepository,
  FinancialSummary,
  CategorySpending,
} from '../../src/domain/repositories/ISummaryRepository';

import { User } from '../../src/domain/entities/User';
import { Account } from '../../src/domain/entities/Account';
import { Category } from '../../src/domain/entities/Category';
import { Transaction } from '../../src/domain/entities/Transaction';
import { Budget } from '../../src/domain/entities/Budget';
import { Goal } from '../../src/domain/entities/Goal';

/** Implementacoes em memoria dos ports - usadas nos testes (sem banco). */

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.value === email.toLowerCase().trim()) ?? null;
  }
  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}

export class InMemoryAccountRepository implements IAccountRepository {
  accounts: Account[] = [];
  async findById(id: string, userId: string): Promise<Account | null> {
    return this.accounts.find((a) => a.id === id && a.userId === userId) ?? null;
  }
  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accounts.filter((a) => a.userId === userId);
  }
  async create(account: Account): Promise<Account> {
    this.accounts.push(account);
    return account;
  }
  async update(account: Account): Promise<Account> {
    this.accounts = this.accounts.map((a) => (a.id === account.id ? account : a));
    return account;
  }
  async delete(id: string, userId: string): Promise<void> {
    this.accounts = this.accounts.filter((a) => !(a.id === id && a.userId === userId));
  }
}

export class InMemoryCategoryRepository implements ICategoryRepository {
  categories: Category[] = [];
  async findById(id: string, userId: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id && c.userId === userId) ?? null;
  }
  async findAllByUser(userId: string): Promise<Category[]> {
    return this.categories.filter((c) => c.userId === userId);
  }
  async create(category: Category): Promise<Category> {
    this.categories.push(category);
    return category;
  }
  async update(category: Category): Promise<Category> {
    this.categories = this.categories.map((c) => (c.id === category.id ? category : c));
    return category;
  }
  async delete(id: string, userId: string): Promise<void> {
    this.categories = this.categories.filter((c) => !(c.id === id && c.userId === userId));
  }
}

export class InMemoryTransactionRepository implements ITransactionRepository {
  transactions: Transaction[] = [];
  async findById(id: string, userId: string): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id && t.userId === userId) ?? null;
  }
  async findAllByUser(userId: string, filter?: TransactionFilter): Promise<Transaction[]> {
    return this.transactions.filter((t) => {
      if (t.userId !== userId) return false;
      if (filter?.accountId && t.accountId !== filter.accountId) return false;
      if (filter?.categoryId && t.categoryId !== filter.categoryId) return false;
      if (filter?.type && t.type !== filter.type) return false;
      return true;
    });
  }
  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction);
    return transaction;
  }
  async update(transaction: Transaction): Promise<Transaction> {
    this.transactions = this.transactions.map((t) => (t.id === transaction.id ? transaction : t));
    return transaction;
  }
  async delete(id: string, userId: string): Promise<void> {
    this.transactions = this.transactions.filter((t) => !(t.id === id && t.userId === userId));
  }
}

export class InMemoryBudgetRepository implements IBudgetRepository {
  budgets: Budget[] = [];
  async findById(id: string, userId: string): Promise<Budget | null> {
    return this.budgets.find((b) => b.id === id && b.userId === userId) ?? null;
  }
  async findAllByUser(userId: string): Promise<Budget[]> {
    return this.budgets.filter((b) => b.userId === userId);
  }
  async create(budget: Budget): Promise<Budget> {
    this.budgets.push(budget);
    return budget;
  }
  async update(budget: Budget): Promise<Budget> {
    this.budgets = this.budgets.map((b) => (b.id === budget.id ? budget : b));
    return budget;
  }
  async delete(id: string, userId: string): Promise<void> {
    this.budgets = this.budgets.filter((b) => !(b.id === id && b.userId === userId));
  }
}

export class InMemoryGoalRepository implements IGoalRepository {
  goals: Goal[] = [];
  async findById(id: string, userId: string): Promise<Goal | null> {
    return this.goals.find((g) => g.id === id && g.userId === userId) ?? null;
  }
  async findAllByUser(userId: string): Promise<Goal[]> {
    return this.goals.filter((g) => g.userId === userId);
  }
  async create(goal: Goal): Promise<Goal> {
    this.goals.push(goal);
    return goal;
  }
  async update(goal: Goal): Promise<Goal> {
    this.goals = this.goals.map((g) => (g.id === goal.id ? goal : g));
    return goal;
  }
  async delete(id: string, userId: string): Promise<void> {
    this.goals = this.goals.filter((g) => !(g.id === id && g.userId === userId));
  }
}

export class InMemorySummaryRepository implements ISummaryRepository {
  constructor(
    private readonly accountRepo: InMemoryAccountRepository,
    private readonly txRepo: InMemoryTransactionRepository,
    private readonly categoryRepo: InMemoryCategoryRepository,
  ) {}

  async getSummary(userId: string): Promise<FinancialSummary> {
    const accounts = await this.accountRepo.findAllByUser(userId);
    const initialTotal = accounts.reduce((acc, a) => acc + a.initialBalance, 0);
    const txs = await this.txRepo.findAllByUser(userId);
    const categories = await this.categoryRepo.findAllByUser(userId);

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory = new Map<string, CategorySpending>();

    for (const t of txs) {
      if (t.type === 'INCOME') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        const cat = categories.find((c) => c.id === t.categoryId);
        const existing = byCategory.get(t.categoryId);
        if (existing) existing.total += t.amount;
        else
          byCategory.set(t.categoryId, {
            categoryId: t.categoryId,
            categoryName: cat?.name ?? 'Sem categoria',
            color: cat?.color ?? '#94a3b8',
            total: t.amount,
          });
      }
    }

    return {
      balance: initialTotal + totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactionCount: txs.length,
      spendingByCategory: Array.from(byCategory.values()).sort((a, b) => b.total - a.total),
    };
  }
}
