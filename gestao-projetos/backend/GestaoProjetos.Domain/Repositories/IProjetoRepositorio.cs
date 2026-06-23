using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Domain.Repositories;

public interface IProjetoRepositorio : IRepositorio<Projeto>
{
    Task<IReadOnlyList<Projeto>> ListarComEquipeAsync(CancellationToken ct = default);
    Task<Projeto?> ObterComTarefasAsync(Guid id, CancellationToken ct = default);
}
