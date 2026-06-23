import { Category } from '../entities/Category';

export interface ICategoryRepository {
  findById(id: string, userId: string): Promise<Category | null>;
  findAllByUser(userId: string): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string, userId: string): Promise<void>;
}
