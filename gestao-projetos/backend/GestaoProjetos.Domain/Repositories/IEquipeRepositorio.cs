using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Domain.Repositories;

public interface IEquipeRepositorio : IRepositorio<Equipe>
{
    Task<IReadOnlyList<Equipe>> ListarComMembrosAsync(CancellationToken ct = default);
}
