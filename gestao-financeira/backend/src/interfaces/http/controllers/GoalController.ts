import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createGoalSchema, updateGoalSchema } from '../validation/schemas';

export class GoalController {
  constructor(private readonly c: Container) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = createGoalSchema.parse(req.body);
    res.status(201).json(await this.c.useCases.createGoal.execute(req.userId!, dto));
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.listGoals.execute(req.userId!));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = updateGoalSchema.parse(req.body);
    res.json(await this.c.useCases.updateGoal.execute(req.userId!, req.params.id, dto));
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.c.useCases.deleteGoal.execute(req.userId!, req.params.id);
    res.status(204).send();
  };
}
