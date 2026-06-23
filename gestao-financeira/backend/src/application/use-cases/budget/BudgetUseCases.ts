import { IBudgetRepository } from '../../../domain/repositories/IBudgetRepository';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IIdGenerator } from '../../ports/IIdGenerator';
import { Budget } from '../../../domain/entities/Budget';
import { NotFoundError } from '../../../domain/errors/DomainError';
import { CreateBudgetDTO, UpdateBudgetDTO, BudgetOutputDTO } from '../../dtos';
import { toBudgetDTO } from '../../dtos/mappers';

export class CreateBudgetUseCase {
  constructor(
    private readonly repo: IBudgetRepository,
    private readonly categoryRepo: ICategoryRepository,
    private readonly ids: IIdGenerator,
  ) {}
  async execute(userId: string, dto: CreateBudgetDTO): Promise<BudgetOutputDTO> {
    const category = await this.categoryRepo.findById(dto.categoryId, userId);
    if (!category) throw new NotFoundError('Categoria informada nao existe.');
    const budget = Budget.create({
      id: this.ids.generate(),
      amount: dto.amount,
      month: dto.month,
      year: dto.year,
      userId,
      categoryId: dto.categoryId,
    });
    return toBudgetDTO(await this.repo.create(budget));
  }
}

export class ListBudgetsUseCase {
  constructor(private readonly repo: IBudgetRepository) {}
  async execute(userId: string): Promise<BudgetOutputDTO[]> {
    return (await this.repo.findAllByUser(userId)).map(toBudgetDTO);
  }
}

export class UpdateBudgetUseCase {
  constructor(private readonly repo: IBudgetRepository) {}
  async execute(userId: string, id: string, dto: UpdateBudgetDTO): Promise<BudgetOutputDTO> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Orcamento nao encontrado.');
    const updated = Budget.create({
      id: existing.id,
      amount: dto.amount ?? existing.amount,
      month: dto.month ?? existing.month,
      year: dto.year ?? existing.year,
      userId,
      categoryId: dto.categoryId ?? existing.categoryId,
      createdAt: existing.createdAt,
    });
    return toBudgetDTO(await this.repo.update(updated));
  }
}

export class DeleteBudgetUseCase {
  constructor(private readonly repo: IBudgetRepository) {}
  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Orcamento nao encontrado.');
    await this.repo.delete(id, userId);
  }
}
