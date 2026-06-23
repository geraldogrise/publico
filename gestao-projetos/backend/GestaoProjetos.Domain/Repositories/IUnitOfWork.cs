namespace GestaoProjetos.Domain.Repositories;

/// <summary>
/// Port que coordena a persistencia transacional das alteracoes.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SalvarAlteracoesAsync(CancellationToken ct = default);
}
