import { IGoalRepository } from '../../../domain/repositories/IGoalRepository';
import { IIdGenerator } from '../../ports/IIdGenerator';
import { Goal } from '../../../domain/entities/Goal';
import { NotFoundError } from '../../../domain/errors/DomainError';
import { CreateGoalDTO, UpdateGoalDTO, GoalOutputDTO } from '../../dtos';
import { toGoalDTO } from '../../dtos/mappers';

export class CreateGoalUseCase {
  constructor(
    private readonly repo: IGoalRepository,
    private readonly ids: IIdGenerator,
  ) {}
  async execute(userId: string, dto: CreateGoalDTO): Promise<GoalOutputDTO> {
    const goal = Goal.create({
      id: this.ids.generate(),
      name: dto.name,
      targetAmount: dto.targetAmount,
      currentAmount: dto.currentAmount ?? 0,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      userId,
    });
    return toGoalDTO(await this.repo.create(goal));
  }
}

export class ListGoalsUseCase {
  constructor(private readonly repo: IGoalRepository) {}
  async execute(userId: string): Promise<GoalOutputDTO[]> {
    return (await this.repo.findAllByUser(userId)).map(toGoalDTO);
  }
}

export class UpdateGoalUseCase {
  constructor(private readonly repo: IGoalRepository) {}
  async execute(userId: string, id: string, dto: UpdateGoalDTO): Promise<GoalOutputDTO> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Meta nao encontrada.');
    const updated = Goal.create({
      id: existing.id,
      name: dto.name ?? existing.name,
      targetAmount: dto.targetAmount ?? existing.targetAmount,
      currentAmount: dto.currentAmount ?? existing.currentAmount,
      deadline:
        dto.deadline !== undefined
          ? dto.deadline
            ? new Date(dto.deadline)
            : null
          : existing.deadline,
      userId,
      createdAt: existing.createdAt,
    });
    return toGoalDTO(await this.repo.update(updated));
  }
}

export class DeleteGoalUseCase {
  constructor(private readonly repo: IGoalRepository) {}
  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Meta nao encontrada.');
    await this.repo.delete(id, userId);
  }
}
