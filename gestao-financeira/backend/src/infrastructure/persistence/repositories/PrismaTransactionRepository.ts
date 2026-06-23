import { PrismaClient, Prisma } from '@prisma/client';
import {
  ITransactionRepository,
  TransactionFilter,
} from '../../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';

interface TxRow {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: Date;
  userId: string;
  accountId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: { tagId: string }[];
}

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: TxRow): Transaction {
    return Transaction.create({
      id: row.id,
      description: row.description,
      amount: row.amount,
      type: row.type,
      date: row.date,
      userId: row.userId,
      accountId: row.accountId,
      categoryId: row.categoryId,
      tagIds: (row.tags ?? []).map((t) => t.tagId),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, userId: string): Promise<Transaction | null> {
    const row = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { tags: true },
    });
    return row ? this.toDomain(row as TxRow) : null;
  }

  async findAllByUser(userId: string, filter?: TransactionFilter): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };
    if (filter?.accountId) where.accountId = filter.accountId;
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.type) where.type = filter.type;
    if (filter?.from || filter?.to) {
      where.date = {};
      if (filter.from) (where.date as Prisma.DateTimeFilter).gte = filter.from;
      if (filter.to) (where.date as Prisma.DateTimeFilter).lte = filter.to;
    }
    const rows = await this.prisma.transaction.findMany({
      where,
      include: { tags: true },
      orderBy: { date: 'desc' },
    });
    return rows.map((r) => this.toDomain(r as TxRow));
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const row = await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        userId: transaction.userId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        tags: {
          create: transaction.tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: { tags: true },
    });
    return this.toDomain(row as TxRow);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const row = await this.prisma.$transaction(async (tx) => {
      await tx.tagsOnTransactions.deleteMany({ where: { transactionId: transaction.id } });
      return tx.transaction.update({
        where: { id: transaction.id },
        data: {
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date,
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
          tags: {
            create: transaction.tagIds.map((tagId) => ({ tagId })),
          },
        },
        include: { tags: true },
      });
    });
    return this.toDomain(row as TxRow);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.transaction.deleteMany({ where: { id, userId } });
  }
}
