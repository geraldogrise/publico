import { AccountType } from './enums';
import { ValidationError } from '../errors/DomainError';

export interface AccountProps {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Entidade de dominio Conta (carteira / banco). */
export class Account {
  private constructor(private props: AccountProps) {}

  static create(params: {
    id: string;
    name: string;
    type: string;
    initialBalance: number;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Account {
    if (!params.name || params.name.trim().length < 1) {
      throw new ValidationError('Nome da conta e obrigatorio.');
    }
    if (!Object.values(AccountType).includes(params.type as AccountType)) {
      throw new ValidationError(`Tipo de conta invalido: ${params.type}.`);
    }
    return new Account({
      id: params.id,
      name: params.name.trim(),
      type: params.type as AccountType,
      initialBalance: params.initialBalance ?? 0,
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
  get type(): AccountType {
    return this.props.type;
  }
  get initialBalance(): number {
    return this.props.initialBalance;
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
