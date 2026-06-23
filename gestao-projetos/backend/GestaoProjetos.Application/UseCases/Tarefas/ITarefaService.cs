using GestaoProjetos.Application.DTOs;

namespace GestaoProjetos.Application.UseCases.Tarefas;

public interface ITarefaService
{
    Task<IReadOnlyList<TarefaDto>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default);
    Task<TarefaDto> ObterAsync(Guid id, CancellationToken ct = default);
    Task<TarefaDto> CriarAsync(CriarTarefaRequest request, CancellationToken ct = default);
    Task<TarefaDto> AtualizarAsync(Guid id, AtualizarTarefaRequest request, CancellationToken ct = default);
    Task<TarefaDto> MoverAsync(Guid id, MoverTarefaRequest request, CancellationToken ct = default);
    Task RemoverAsync(Guid id, CancellationToken ct = default);
}
