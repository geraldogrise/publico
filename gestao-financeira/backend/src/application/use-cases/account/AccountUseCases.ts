import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { IIdGenerator } from '../../ports/IIdGenerator';
import { Account } from '../../../domain/entities/Account';
import { NotFoundError } from '../../../domain/errors/DomainError';
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  AccountOutputDTO,
} from '../../dtos';
import { toAccountDTO } from '../../dtos/mappers';

export class CreateAccountUseCase {
  constructor(
    private readonly repo: IAccountRepository,
    private readonly ids: IIdGenerator,
  ) {}
  async execute(userId: string, dto: CreateAccountDTO): Promise<AccountOutputDTO> {
    const account = Account.create({
      id: this.ids.generate(),
      name: dto.name,
      type: dto.type,
      initialBalance: dto.initialBalance ?? 0,
      userId,
    });
    return toAccountDTO(await this.repo.create(account));
  }
}

export class ListAccountsUseCase {
  constructor(private readonly repo: IAccountRepository) {}
  async execute(userId: string): Promise<AccountOutputDTO[]> {
    const accounts = await this.repo.findAllByUser(userId);
    return accounts.map(toAccountDTO);
  }
}

export class GetAccountUseCase {
  constructor(private readonly repo: IAccountRepository) {}
  async execute(userId: string, id: string): Promise<AccountOutputDTO> {
    const account = await this.repo.findById(id, userId);
    if (!account) throw new NotFoundError('Conta nao encontrada.');
    return toAccountDTO(account);
  }
}

export class UpdateAccountUseCase {
  constructor(private readonly repo: IAccountRepository) {}
  async execute(userId: string, id: string, dto: UpdateAccountDTO): Promise<AccountOutputDTO> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Conta nao encontrada.');
    const updated = Account.create({
      id: existing.id,
      name: dto.name ?? existing.name,
      type: dto.type ?? existing.type,
      initialBalance: dto.initialBalance ?? existing.initialBalance,
      userId,
      createdAt: existing.createdAt,
    });
    return toAccountDTO(await this.repo.update(updated));
  }
}

export class DeleteAccountUseCase {
  constructor(private readonly repo: IAccountRepository) {}
  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Conta nao encontrada.');
    await this.repo.delete(id, userId);
  }
}
