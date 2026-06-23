using GestaoProjetos.Application.DTOs;

namespace GestaoProjetos.Application.UseCases.Equipes;

public interface IEquipeService
{
    Task<IReadOnlyList<EquipeDto>> ListarAsync(CancellationToken ct = default);
    Task<EquipeDto> ObterAsync(Guid id, CancellationToken ct = default);
    Task<EquipeDto> CriarAsync(CriarEquipeRequest request, CancellationToken ct = default);
    Task RemoverAsync(Guid id, CancellationToken ct = default);
}
