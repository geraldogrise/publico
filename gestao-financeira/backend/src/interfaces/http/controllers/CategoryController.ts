import { Response } from 'express';
import { Container } from '../../../main/container';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createCategorySchema, updateCategorySchema } from '../validation/schemas';

export class CategoryController {
  constructor(private readonly c: Container) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = createCategorySchema.parse(req.body);
    res.status(201).json(await this.c.useCases.createCategory.execute(req.userId!, dto));
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.listCategories.execute(req.userId!));
  };

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json(await this.c.useCases.getCategory.execute(req.userId!, req.params.id));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const dto = updateCategorySchema.parse(req.body);
    res.json(await this.c.useCases.updateCategory.execute(req.userId!, req.params.id, dto));
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.c.useCases.deleteCategory.execute(req.userId!, req.params.id);
    res.status(204).send();
  };
}
