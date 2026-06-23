import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createTransactionSchema, updateTransactionSchema } from '../validation/schemas';
import { TransactionFilter } from '../../../domain/repositories/ITransactionRepository';

export class TransactionController {
  constructor(private readonly c: Container) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = createTransactionSchema.parse(req.body);
    res.status(201).json(await this.c.useCases.createTransaction.execute(req.userId!, dto));
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const filter: TransactionFilter = {};
    if (req.query.accountId) filter.accountId = String(req.query.accountId);
    if (req.query.categoryId) filter.categoryId = String(req.query.categoryId);
    if (req.query.type) filter.type = String(req.query.type);
    if (req.query.from) filter.from = new Date(String(req.query.from));
    if (req.query.to) filter.to = new Date(String(req.query.to));
    res.json(await this.c.useCases.listTransactions.execute(req.userId!, filter));
  };

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.getTransaction.execute(req.userId!, req.params.id));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = updateTransactionSchema.parse(req.body);
    res.json(await this.c.useCases.updateTransaction.execute(req.userId!, req.params.id, dto));
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.c.useCases.deleteTransaction.execute(req.userId!, req.params.id);
    res.status(204).send();
  };
}
