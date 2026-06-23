import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createAccountSchema, updateAccountSchema } from '../validation/schemas';

export class AccountController {
  constructor(private readonly c: Container) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = createAccountSchema.parse(req.body);
    const result = await this.c.useCases.createAccount.execute(req.userId!, dto);
    res.status(201).json(result);
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.listAccounts.execute(req.userId!));
  };

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.getAccount.execute(req.userId!, req.params.id));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = updateAccountSchema.parse(req.body);
    res.json(await this.c.useCases.updateAccount.execute(req.userId!, req.params.id, dto));
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.c.useCases.deleteAccount.execute(req.userId!, req.params.id);
    res.status(204).send();
  };
}
