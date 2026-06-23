import { ValidationError } from '../errors/DomainError';

export interface TagProps {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

/** Entidade de dominio Etiqueta/Tag (many-to-many com Transacao). */
export class Tag {
  private constructor(private props: TagProps) {}

  static create(params: {
    id: string;
    name: string;
    color?: string;
    userId: string;
    createdAt?: Date;
  }): Tag {
    if (!params.name || params.name.trim().length < 1) {
      throw new ValidationError('Nome da tag e obrigatorio.');
    }
    return new Tag({
      id: params.id,
      name: params.name.trim(),
      color: params.color ?? '#64748b',
      userId: params.userId,
      createdAt: params.createdAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get color(): string {
    return this.props.color;
  }
  get userId(): string {
    return this.props.userId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
