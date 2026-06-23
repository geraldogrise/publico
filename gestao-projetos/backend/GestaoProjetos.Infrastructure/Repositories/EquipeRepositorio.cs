using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

public class EquipeRepositorio : RepositorioBase<Equipe>, IEquipeRepositorio
{
    public EquipeRepositorio(AppDbContext context) : base(context) { }

    public override async Task<Equipe?> ObterPorIdAsync(Guid id, CancellationToken ct = default) =>
        await Set
            .Include(e => e.Membros).ThenInclude(m => m.Usuario)
            .Include(e => e.Projetos)
            .FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<IReadOnlyList<Equipe>> ListarComMembrosAsync(CancellationToken ct = default) =>
        await Set.AsNoTracking()
            .Include(e => e.Membros).ThenInclude(m => m.Usuario)
            .Include(e => e.Projetos)
            .OrderBy(e => e.Nome)
            .ToListAsync(ct);
}
