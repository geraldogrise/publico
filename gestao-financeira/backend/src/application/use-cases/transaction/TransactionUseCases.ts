import {
  ITransactionRepository,
  TransactionFilter,
} from '../../../domain/repositories/ITransactionRepository';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IIdGenerator } from '../../ports/IIdGenerator';
import { Transaction } from '../../../domain/entities/Transaction';
import { NotFoundError } from '../../../domain/errors/DomainError';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionOutputDTO,
} from '../../dtos';
import { toTransactionDTO } from '../../dtos/mappers';

export class CreateTransactionUseCase {
  constructor(
    private readonly repo: ITransactionRepository,
    private readonly accountRepo: IAccountRepository,
    private readonly categoryRepo: ICategoryRepository,
    private readonly ids: IIdGenerator,
  ) {}
  async execute(userId: string, dto: CreateTransactionDTO): Promise<TransactionOutputDTO> {
    const account = await this.accountRepo.findById(dto.accountId, userId);
    if (!account) throw new NotFoundError('Conta informada nao existe.');
    const category = await this.categoryRepo.findById(dto.categoryId, userId);
    if (!category) throw new NotFoundError('Categoria informada nao existe.');

    const transaction = Transaction.create({
      id: this.ids.generate(),
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      date: dto.date ? new Date(dto.date) : new Date(),
      userId,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      tagIds: dto.tagIds ?? [],
    });
    return toTransactionDTO(await this.repo.create(transaction));
  }
}

export class ListTransactionsUseCase {
  constructor(private readonly repo: ITransactionRepository) {}
  async execute(userId: string, filter?: TransactionFilter): Promise<TransactionOutputDTO[]> {
    return (await this.repo.findAllByUser(userId, filter)).map(toTransactionDTO);
  }
}

export class GetTransactionUseCase {
  constructor(private readonly repo: ITransactionRepository) {}
  async execute(userId: string, id: string): Promise<TransactionOutputDTO> {
    const tx = await this.repo.findById(id, userId);
    if (!tx) throw new NotFoundError('Transacao nao encontrada.');
    return toTransactionDTO(tx);
  }
}

export class UpdateTransactionUseCase {
  constructor(private readonly repo: ITransactionRepository) {}
  async execute(userId: string, id: string, dto: UpdateTransactionDTO): Promise<TransactionOutputDTO> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Transacao nao encontrada.');
    const updated = Transaction.create({
      id: existing.id,
      description: dto.description ?? existing.description,
      amount: dto.amount ?? existing.amount,
      type: dto.type ?? existing.type,
      date: dto.date ? new Date(dto.date) : existing.date,
      userId,
      accountId: dto.accountId ?? existing.accountId,
      categoryId: dto.categoryId ?? existing.categoryId,
      tagIds: dto.tagIds ?? existing.tagIds,
      createdAt: existing.createdAt,
    });
    return toTransactionDTO(await this.repo.update(updated));
  }
}

export class DeleteTransactionUseCase {
  constructor(private readonly repo: ITransactionRepository) {}
  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Transacao nao encontrada.');
    await this.repo.delete(id, userId);
  }
}
