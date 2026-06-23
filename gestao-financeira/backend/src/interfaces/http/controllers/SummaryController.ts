import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class SummaryController {
  constructor(private readonly c: Container) {}

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;
    res.json(await this.c.useCases.getSummary.execute(req.userId!, from, to));
  };
}
