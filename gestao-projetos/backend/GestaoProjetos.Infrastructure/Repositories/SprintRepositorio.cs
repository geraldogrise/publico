using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

public class SprintRepositorio : RepositorioBase<Sprint>, ISprintRepositorio
{
    public SprintRepositorio(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Sprint>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default) =>
        await Set.AsNoTracking()
            .Include(s => s.Tarefas)
            .Where(s => s.ProjetoId == projetoId)
            .OrderBy(s => s.DataInicio)
            .ToListAsync(ct);
}
