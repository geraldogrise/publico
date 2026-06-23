import { Request, Response } from 'express';
import { Container } from '../../../main/container';
import { loginSchema } from '../validation/schemas';

export class AuthController {
  constructor(private readonly container: Container) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = loginSchema.parse(req.body);
    const result = await this.container.useCases.login.execute(dto);
    res.status(200).json(result);
  };
}
