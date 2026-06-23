import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createBudgetSchema, updateBudgetSchema } from '../validation/schemas';

export class BudgetController {
  constructor(private readonly c: Container) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = createBudgetSchema.parse(req.body);
    res.status(201).json(await this.c.useCases.createBudget.execute(req.userId!, dto));
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.listBudgets.execute(req.userId!));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = updateBudgetSchema.parse(req.body);
    res.json(await this.c.useCases.updateBudget.execute(req.userId!, req.params.id, dto));
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.c.useCases.deleteBudget.execute(req.userId!, req.params.id);
    res.status(204).send();
  };
}
