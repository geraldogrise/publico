import { Account } from '../../domain/entities/Account';
import { Category } from '../../domain/entities/Category';
import { Transaction } from '../../domain/entities/Transaction';
import { Budget } from '../../domain/entities/Budget';
import { Goal } from '../../domain/entities/Goal';
import {
  AccountOutputDTO,
  CategoryOutputDTO,
  TransactionOutputDTO,
  BudgetOutputDTO,
  GoalOutputDTO,
} from './index';

/** Mappers de entidade de dominio -> DTO de saida (apresentacao). */
export const toAccountDTO = (a: Account): AccountOutputDTO => ({
  id: a.id,
  name: a.name,
  type: a.type,
  initialBalance: a.initialBalance,
  createdAt: a.createdAt.toISOString(),
});

export const toCategoryDTO = (c: Category): CategoryOutputDTO => ({
  id: c.id,
  name: c.name,
  type: c.type,
  color: c.color,
  icon: c.icon,
  createdAt: c.createdAt.toISOString(),
});

export const toTransactionDTO = (t: Transaction): TransactionOutputDTO => ({
  id: t.id,
  description: t.description,
  amount: t.amount,
  type: t.type,
  date: t.date.toISOString(),
  accountId: t.accountId,
  categoryId: t.categoryId,
  tagIds: t.tagIds,
  createdAt: t.createdAt.toISOString(),
});

export const toBudgetDTO = (b: Budget): BudgetOutputDTO => ({
  id: b.id,
  amount: b.amount,
  month: b.month,
  year: b.year,
  categoryId: b.categoryId,
  createdAt: b.createdAt.toISOString(),
});

export const toGoalDTO = (g: Goal): GoalOutputDTO => ({
  id: g.id,
  name: g.name,
  targetAmount: g.targetAmount,
  currentAmount: g.currentAmount,
  progress: Math.round(g.progress * 100) / 100,
  deadline: g.deadline ? g.deadline.toISOString() : null,
  createdAt: g.createdAt.toISOString(),
});
