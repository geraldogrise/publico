import { Goal } from '../entities/Goal';

export interface IGoalRepository {
  findById(id: string, userId: string): Promise<Goal | null>;
  findAllByUser(userId: string): Promise<Goal[]>;
  create(goal: Goal): Promise<Goal>;
  update(goal: Goal): Promise<Goal>;
  delete(id: string, userId: string): Promise<void>;
}
