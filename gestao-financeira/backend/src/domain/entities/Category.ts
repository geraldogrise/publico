import { TransactionType } from './enums';
import { ValidationError } from '../errors/DomainError';

export interface CategoryProps {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Entidade de dominio Categoria. */
export class Category {
  private constructor(private props: CategoryProps) {}

  static create(params: {
    id: string;
    name: string;
    type: string;
    color?: string;
    icon?: string | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Category {
    if (!params.name || params.name.trim().length < 1) {
      throw new ValidationError('Nome da categoria e obrigatorio.');
    }
    if (!Object.values(TransactionType).includes(params.type as TransactionType)) {
      throw new ValidationError(`Tipo de categoria invalido: ${params.type}.`);
    }
    return new Category({
      id: params.id,
      name: params.name.trim(),
      type: params.type as TransactionType,
      color: params.color ?? '#3b82f6',
      icon: params.icon ?? null,
      userId: params.userId,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get type(): TransactionType {
    return this.props.type;
  }
  get color(): string {
    return this.props.color;
  }
  get icon(): string | null {
    return this.props.icon;
  }
  get userId(): string {
    return this.props.userId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
