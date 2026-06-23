import { PrismaClient } from '@prisma/client';
import { IGoalRepository } from '../../../domain/repositories/IGoalRepository';
import { Goal } from '../../../domain/entities/Goal';

export class PrismaGoalRepository implements IGoalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Goal {
    return Goal.create({
      id: row.id,
      name: row.name,
      targetAmount: row.targetAmount,
      currentAmount: row.currentAmount,
      deadline: row.deadline,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, userId: string): Promise<Goal | null> {
    const row = await this.prisma.goal.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllByUser(userId: string): Promise<Goal[]> {
    const rows = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(goal: Goal): Promise<Goal> {
    const row = await this.prisma.goal.create({
      data: {
        id: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        userId: goal.userId,
      },
    });
    return this.toDomain(row);
  }

  async update(goal: Goal): Promise<Goal> {
    const row = await this.prisma.goal.update({
      where: { id: goal.id },
      data: {
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.goal.deleteMany({ where: { id, userId } });
  }
}
