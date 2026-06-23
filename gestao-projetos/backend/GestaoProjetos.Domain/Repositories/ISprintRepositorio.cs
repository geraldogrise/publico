using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Domain.Repositories;

public interface ISprintRepositorio : IRepositorio<Sprint>
{
    Task<IReadOnlyList<Sprint>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default);
}
