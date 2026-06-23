import { ValidationError } from '../errors/DomainError';

export interface GoalProps {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Entidade de dominio Meta de economia. */
export class Goal {
  private constructor(private props: GoalProps) {}

  static create(params: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: Date | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Goal {
    if (!params.name || params.name.trim().length < 1) {
      throw new ValidationError('Nome da meta e obrigatorio.');
    }
    if (params.targetAmount <= 0) {
      throw new ValidationError('Valor alvo da meta deve ser positivo.');
    }
    if ((params.currentAmount ?? 0) < 0) {
      throw new ValidationError('Valor acumulado nao pode ser negativo.');
    }
    return new Goal({
      id: params.id,
      name: params.name.trim(),
      targetAmount: params.targetAmount,
      currentAmount: params.currentAmount ?? 0,
      deadline: params.deadline ?? null,
      userId: params.userId,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  /** Percentual concluido (0-100). */
  get progress(): number {
    if (this.props.targetAmount <= 0) return 0;
    return Math.min(100, (this.props.currentAmount / this.props.targetAmount) * 100);
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get targetAmount(): number {
    return this.props.targetAmount;
  }
  get currentAmount(): number {
    return this.props.currentAmount;
  }
  get deadline(): Date | null {
    return this.props.deadline;
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
