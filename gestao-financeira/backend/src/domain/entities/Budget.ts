import { ValidationError } from '../errors/DomainError';

export interface BudgetProps {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Entidade de dominio Orcamento (por categoria/mes). */
export class Budget {
  private constructor(private props: BudgetProps) {}

  static create(params: {
    id: string;
    amount: number;
    month: number;
    year: number;
    userId: string;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Budget {
    if (params.amount <= 0) {
      throw new ValidationError('Valor do orcamento deve ser positivo.');
    }
    if (params.month < 1 || params.month > 12) {
      throw new ValidationError('Mes do orcamento invalido (1-12).');
    }
    if (params.year < 2000 || params.year > 2100) {
      throw new ValidationError('Ano do orcamento invalido.');
    }
    if (!params.categoryId) {
      throw new ValidationError('Categoria do orcamento e obrigatoria.');
    }
    return new Budget({
      id: params.id,
      amount: params.amount,
      month: params.month,
      year: params.year,
      userId: params.userId,
      categoryId: params.categoryId,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }
  get amount(): number {
    return this.props.amount;
  }
  get month(): number {
    return this.props.month;
  }
  get year(): number {
    return this.props.year;
  }
  get userId(): string {
    return this.props.userId;
  }
  get categoryId(): string {
    return this.props.categoryId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
