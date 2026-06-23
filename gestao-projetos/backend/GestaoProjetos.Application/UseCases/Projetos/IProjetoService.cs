using GestaoProjetos.Application.DTOs;

namespace GestaoProjetos.Application.UseCases.Projetos;

public interface IProjetoService
{
    Task<IReadOnlyList<ProjetoDto>> ListarAsync(CancellationToken ct = default);
    Task<ProjetoDto> ObterAsync(Guid id, CancellationToken ct = default);
    Task<ProjetoDto> CriarAsync(CriarProjetoRequest request, CancellationToken ct = default);
    Task<ProjetoDto> AtualizarAsync(Guid id, AtualizarProjetoRequest request, CancellationToken ct = default);
    Task RemoverAsync(Guid id, CancellationToken ct = default);
}
