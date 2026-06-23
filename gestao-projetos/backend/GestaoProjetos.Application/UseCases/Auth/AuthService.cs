using GestaoProjetos.Application.Abstractions;
using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Application.Mapeamento;
using GestaoProjetos.Domain.Repositories;

namespace GestaoProjetos.Application.UseCases.Auth;

/// <summary>
/// Caso de uso de autenticacao: valida credenciais e emite token JWT.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUsuarioRepositorio _usuarios;
    private readonly IServicoSenha _senha;
    private readonly IGeradorToken _token;

    public AuthService(IUsuarioRepositorio usuarios, IServicoSenha senha, IGeradorToken token)
    {
        _usuarios = usuarios;
        _senha = senha;
        _token = token;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Senha))
            throw new AutenticacaoException();

        var usuario = await _usuarios.ObterPorEmailAsync(request.Email.Trim().ToLowerInvariant(), ct);
        if (usuario is null || !usuario.Ativo)
            throw new AutenticacaoException();

        if (!_senha.Verificar(request.Senha, usuario.SenhaHash))
            throw new AutenticacaoException();

        var (token, expira) = _token.GerarToken(usuario);
        return new LoginResponse(token, expira, usuario.ParaDto());
    }
}
