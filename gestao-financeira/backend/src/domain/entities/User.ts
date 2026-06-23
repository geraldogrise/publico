import { Email } from '../value-objects/Email';
import { ValidationError } from '../errors/DomainError';

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  password: string; // hash
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade de dominio Usuario. Classe pura, sem framework.
 */
export class User {
  private constructor(private props: UserProps) {}

  static create(params: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    if (!params.name || params.name.trim().length < 2) {
      throw new ValidationError('Nome do usuario deve ter ao menos 2 caracteres.');
    }
    if (!params.password || params.password.length < 6) {
      throw new ValidationError('Senha (hash) invalida.');
    }
    return new User({
      id: params.id,
      name: params.name.trim(),
      email: Email.create(params.email),
      password: params.password,
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
  get email(): Email {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
