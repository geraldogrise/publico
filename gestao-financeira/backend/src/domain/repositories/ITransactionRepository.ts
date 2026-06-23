import { Transaction } from '../entities/Transaction';

export interface TransactionFilter {
  accountId?: string;
  categoryId?: string;
  type?: string;
  from?: Date;
  to?: Date;
}

export interface ITransactionRepository {
  findById(id: string, userId: string): Promise<Transaction | null>;
  findAllByUser(userId: string, filter?: TransactionFilter): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string, userId: string): Promise<void>;
}
