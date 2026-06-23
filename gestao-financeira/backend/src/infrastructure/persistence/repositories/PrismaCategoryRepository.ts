import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { Category } from '../../../domain/entities/Category';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(row: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    return Category.create({
      id: row.id,
      name: row.name,
      type: row.type,
      color: row.color,
      icon: row.icon,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    const row = await this.prisma.category.findFirst({ where: { id, userId } });
    return row ? this.toDomain(row) : null;
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(category: Category): Promise<Category> {
    const row = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        userId: category.userId,
      },
    });
    return this.toDomain(row);
  }

  async update(category: Category): Promise<Category> {
    const row = await this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.category.deleteMany({ where: { id, userId } });
  }
}
