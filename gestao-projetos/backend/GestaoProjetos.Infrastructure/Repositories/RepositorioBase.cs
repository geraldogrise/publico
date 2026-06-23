using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

/// <summary>
/// Implementacao generica do port IRepositorio usando EF Core (adapter).
/// </summary>
public class RepositorioBase<T> : IRepositorio<T> where T : EntidadeBase
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<T> Set;

    public RepositorioBase(AppDbContext context)
    {
        Context = context;
        Set = context.Set<T>();
    }

    public virtual async Task<T?> ObterPorIdAsync(Guid id, CancellationToken ct = default) =>
        await Set.FirstOrDefaultAsync(e => e.Id == id, ct);

    public virtual async Task<IReadOnlyList<T>> ListarAsync(CancellationToken ct = default) =>
        await Set.AsNoTracking().ToListAsync(ct);

    public virtual async Task AdicionarAsync(T entidade, CancellationToken ct = default) =>
        await Set.AddAsync(entidade, ct);

    public virtual void Atualizar(T entidade) => Set.Update(entidade);

    public virtual void Remover(T entidade) => Set.Remove(entidade);
}
