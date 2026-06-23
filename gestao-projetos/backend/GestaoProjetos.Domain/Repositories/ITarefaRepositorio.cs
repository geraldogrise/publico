using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Domain.Repositories;

public interface ITarefaRepositorio : IRepositorio<Tarefa>
{
    Task<IReadOnlyList<Tarefa>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default);
    Task<Tarefa?> ObterCompletaAsync(Guid id, CancellationToken ct = default);
}
