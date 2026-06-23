import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../ports/IPasswordHasher';
import { ITokenService } from '../../ports/ITokenService';
import { UnauthorizedError } from '../../../domain/errors/DomainError';
import { LoginInputDTO, AuthOutputDTO } from '../../dtos';

/**
 * Caso de uso: autenticar usuario e emitir JWT.
 * Depende apenas de PORTS (inversao de dependencia - SOLID/DIP).
 */
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInputDTO): Promise<AuthOutputDTO> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Credenciais invalidas.');
    }
    const ok = await this.passwordHasher.compare(input.password, user.password);
    if (!ok) {
      throw new UnauthorizedError('Credenciais invalidas.');
    }
    const token = this.tokenService.sign({ sub: user.id, email: user.email.value });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email.value },
    };
  }
}
