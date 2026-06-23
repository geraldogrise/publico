import { PrismaClient } from '@prisma/client';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { Account } from '../../../domain/entities/Account';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: {
    id: string;
    name: string;
    type: string;
    initialBalance: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Account {
    return Account.create({
      id: row.id,
      name: row.name,
      type: row.type,
      initialBalance: row.initialBalance,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, userId: string): Promise<Account | null> {
    const row = await this.prisma.account.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    const rows = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(account: Account): Promise<Account> {
    const row = await this.prisma.account.create({
      data: {
        id: account.id,
        name: account.name,
        type: account.type,
        initialBalance: account.initialBalance,
        userId: account.userId,
      },
    });
    return this.toDomain(row);
  }

  async update(account: Account): Promise<Account> {
    const row = await this.prisma.account.update({
      where: { id: account.id },
      data: {
        name: account.name,
        type: account.type,
        initialBalance: account.initialBalance,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.account.deleteMany({ where: { id, userId } });
  }
}
