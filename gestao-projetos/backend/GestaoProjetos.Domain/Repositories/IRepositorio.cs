using GestaoProjetos.Domain.Common;

namespace GestaoProjetos.Domain.Repositories;

/// <summary>
/// Port generico de persistencia para agregados. As implementacoes
/// (adapters) vivem na camada de Infraestrutura.
/// </summary>
public interface IRepositorio<T> where T : EntidadeBase
{
    Task<T?> ObterPorIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListarAsync(CancellationToken ct = default);
    Task AdicionarAsync(T entidade, CancellationToken ct = default);
    void Atualizar(T entidade);
    void Remover(T entidade);
}
