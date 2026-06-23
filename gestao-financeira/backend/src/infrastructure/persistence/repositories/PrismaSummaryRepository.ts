import { PrismaClient, Prisma } from '@prisma/client';
import {
  ISummaryRepository,
  FinancialSummary,
  CategorySpending,
} from '../../../domain/repositories/ISummaryRepository';

/** Adapter Prisma de consultas de resumo financeiro (agregacoes). */
export class PrismaSummaryRepository implements ISummaryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSummary(userId: string, from?: Date, to?: Date): Promise<FinancialSummary> {
    const where: Prisma.TransactionWhereInput = { userId };
    if (from || to) {
      where.date = {};
      if (from) (where.date as Prisma.DateTimeFilter).gte = from;
      if (to) (where.date as Prisma.DateTimeFilter).lte = to;
    }

    const accounts = await this.prisma.account.findMany({ where: { userId } });
    const initialTotal = accounts.reduce((acc, a) => acc + a.initialBalance, 0);

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: { category: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory = new Map<string, CategorySpending>();

    for (const tx of transactions) {
      if (tx.type === 'INCOME') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        const key = tx.categoryId;
        const existing = byCategory.get(key);
        if (existing) {
          existing.total += tx.amount;
        } else {
          byCategory.set(key, {
            categoryId: tx.categoryId,
            categoryName: tx.category?.name ?? 'Sem categoria',
            color: tx.category?.color ?? '#94a3b8',
            total: tx.amount,
          });
        }
      }
    }

    const round = (n: number) => Math.round(n * 100) / 100;

    return {
      balance: round(initialTotal + totalIncome - totalExpense),
      totalIncome: round(totalIncome),
      totalExpense: round(totalExpense),
      transactionCount: transactions.length,
      spendingByCategory: Array.from(byCategory.values())
        .map((c) => ({ ...c, total: round(c.total) }))
        .sort((a, b) => b.total - a.total),
    };
  }
}
