import { Budget } from '../entities/Budget';

export interface IBudgetRepository {
  findById(id: string, userId: string): Promise<Budget | null>;
  findAllByUser(userId: string): Promise<Budget[]>;
  create(budget: Budget): Promise<Budget>;
  update(budget: Budget): Promise<Budget>;
  delete(id: string, userId: string): Promise<void>;
}
