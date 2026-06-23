import { TransactionType } from './enums';
import { Money } from '../value-objects/Money';
import { ValidationError } from '../errors/DomainError';

export interface TransactionProps {
  id: string;
  description: string;
  amount: Money;
  type: TransactionType;
  date: Date;
  userId: string;
  accountId: string;
  categoryId: string;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade de dominio Transacao. Liga Conta + Categoria.
 * Aplica regra: valor deve ser positivo; o sinal vem do tipo (receita/despesa).
 */
export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(params: {
    id: string;
    description: string;
    amount: number;
    type: string;
    date?: Date;
    userId: string;
    accountId: string;
    categoryId: string;
    tagIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }): Transaction {
    if (!params.description || params.description.trim().length < 1) {
      throw new ValidationError('Descricao da transacao e obrigatoria.');
    }
    const money = Money.fromNumber(params.amount);
    if (!money.isPositive()) {
      throw new ValidationError('Valor da transacao deve ser maior que zero.');
    }
    if (!Object.values(TransactionType).includes(params.type as TransactionType)) {
      throw new ValidationError(`Tipo de transacao invalido: ${params.type}.`);
    }
    if (!params.accountId) {
      throw new ValidationError('Conta da transacao e obrigatoria.');
    }
    if (!params.categoryId) {
      throw new ValidationError('Categoria da transacao e obrigatoria.');
    }
    return new Transaction({
      id: params.id,
      description: params.description.trim(),
      amount: money,
      type: params.type as TransactionType,
      date: params.date ?? new Date(),
      userId: params.userId,
      accountId: params.accountId,
      categoryId: params.categoryId,
      tagIds: params.tagIds ?? [],
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  /** Valor com sinal: despesas sao negativas para fins de saldo. */
  get signedAmount(): number {
    return this.props.type === TransactionType.EXPENSE
      ? -this.props.amount.value
      : this.props.amount.value;
  }

  get id(): string {
    return this.props.id;
  }
  get description(): string {
    return this.props.description;
  }
  get amount(): number {
    return this.props.amount.value;
  }
  get type(): TransactionType {
    return this.props.type;
  }
  get date(): Date {
    return this.props.date;
  }
  get userId(): string {
    return this.props.userId;
  }
  get accountId(): string {
    return this.props.accountId;
  }
  get categoryId(): string {
    return this.props.categoryId;
  }
  get tagIds(): string[] {
    return [...this.props.tagIds];
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
