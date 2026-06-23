import { PrismaClient } from '@prisma/client';
import { IBudgetRepository } from '../../../domain/repositories/IBudgetRepository';
import { Budget } from '../../../domain/entities/Budget';

export class PrismaBudgetRepository implements IBudgetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: {
    id: string;
    amount: number;
    month: number;
    year: number;
    userId: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Budget {
    return Budget.create({
      id: row.id,
      amount: row.amount,
      month: row.month,
      year: row.year,
      userId: row.userId,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, userId: string): Promise<Budget | null> {
    const row = await this.prisma.budget.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllByUser(userId: string): Promise<Budget[]> {
    const rows = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(budget: Budget): Promise<Budget> {
    const row = await this.prisma.budget.create({
      data: {
        id: budget.id,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        userId: budget.userId,
        categoryId: budget.categoryId,
      },
    });
    return this.toDomain(row);
  }

  async update(budget: Budget): Promise<Budget> {
    const row = await this.prisma.budget.update({
      where: { id: budget.id },
      data: {
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        categoryId: budget.categoryId,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.budget.deleteMany({ where: { id, userId } });
  }
}
