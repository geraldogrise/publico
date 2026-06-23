using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

public class ProjetoRepositorio : RepositorioBase<Projeto>, IProjetoRepositorio
{
    public ProjetoRepositorio(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Projeto>> ListarComEquipeAsync(CancellationToken ct = default) =>
        await Set.AsNoTracking()
            .Include(p => p.Equipe)
            .Include(p => p.Tarefas)
            .OrderByDescending(p => p.CriadoEm)
            .ToListAsync(ct);

    public async Task<Projeto?> ObterComTarefasAsync(Guid id, CancellationToken ct = default) =>
        await Set
            .Include(p => p.Equipe)
            .Include(p => p.Tarefas)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
}
