using GestaoProjetos.Application.DTOs;

namespace GestaoProjetos.Application.UseCases.Sprints;

public interface ISprintService
{
    Task<IReadOnlyList<SprintDto>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default);
    Task<SprintDto> CriarAsync(CriarSprintRequest request, CancellationToken ct = default);
    Task RemoverAsync(Guid id, CancellationToken ct = default);
}
