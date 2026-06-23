import { User } from '../entities/User';

/** Port (interface) do repositorio de Usuario. Implementado na infraestrutura. */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
