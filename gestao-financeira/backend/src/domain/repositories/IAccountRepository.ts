import { Account } from '../entities/Account';

export interface IAccountRepository {
  findById(id: string, userId: string): Promise<Account | null>;
  findAllByUser(userId: string): Promise<Account[]>;
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  delete(id: string, userId: string): Promise<void>;
}
