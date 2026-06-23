import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IIdGenerator } from '../../ports/IIdGenerator';
import { Category } from '../../../domain/entities/Category';
import { NotFoundError } from '../../../domain/errors/DomainError';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryOutputDTO,
} from '../../dtos';
import { toCategoryDTO } from '../../dtos/mappers';

export class CreateCategoryUseCase {
  constructor(
    private readonly repo: ICategoryRepository,
    private readonly ids: IIdGenerator,
  ) {}
  async execute(userId: string, dto: CreateCategoryDTO): Promise<CategoryOutputDTO> {
    const category = Category.create({
      id: this.ids.generate(),
      name: dto.name,
      type: dto.type,
      color: dto.color,
      icon: dto.icon ?? null,
      userId,
    });
    return toCategoryDTO(await this.repo.create(category));
  }
}

export class ListCategoriesUseCase {
  constructor(private readonly repo: ICategoryRepository) {}
  async execute(userId: string): Promise<CategoryOutputDTO[]> {
    return (await this.repo.findAllByUser(userId)).map(toCategoryDTO);
  }
}

export class GetCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}
  async execute(userId: string, id: string): Promise<CategoryOutputDTO> {
    const category = await this.repo.findById(id, userId);
    if (!category) throw new NotFoundError('Categoria nao encontrada.');
    return toCategoryDTO(category);
  }
}

export class UpdateCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}
  async execute(userId: string, id: string, dto: UpdateCategoryDTO): Promise<CategoryOutputDTO> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Categoria nao encontrada.');
    const updated = Category.create({
      id: existing.id,
      name: dto.name ?? existing.name,
      type: dto.type ?? existing.type,
      color: dto.color ?? existing.color,
      icon: dto.icon !== undefined ? dto.icon : existing.icon,
      userId,
      createdAt: existing.createdAt,
    });
    return toCategoryDTO(await this.repo.update(updated));
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}
  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Categoria nao encontrada.');
    await this.repo.delete(id, userId);
  }
}
