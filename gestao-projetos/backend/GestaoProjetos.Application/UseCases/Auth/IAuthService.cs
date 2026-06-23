using GestaoProjetos.Application.DTOs;

namespace GestaoProjetos.Application.UseCases.Auth;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}
