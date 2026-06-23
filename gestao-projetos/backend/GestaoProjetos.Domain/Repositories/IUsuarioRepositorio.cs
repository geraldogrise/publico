using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Domain.Repositories;

public interface IUsuarioRepositorio : IRepositorio<Usuario>
{
    Task<Usuario?> ObterPorEmailAsync(string email, CancellationToken ct = default);
}
