using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Repositories;

public class TarefaRepositorio : RepositorioBase<Tarefa>, ITarefaRepositorio
{
    public TarefaRepositorio(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Tarefa>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default) =>
        await Set.AsNoTracking()
            .Include(t => t.Responsavel)
            .Include(t => t.Etiquetas)
            .Include(t => t.Comentarios)
            .Where(t => t.ProjetoId == projetoId)
            .OrderBy(t => t.Status)
            .ThenBy(t => t.Ordem)
            .ToListAsync(ct);

    public async Task<Tarefa?> ObterCompletaAsync(Guid id, CancellationToken ct = default) =>
        await Set
            .Include(t => t.Responsavel)
            .Include(t => t.Etiquetas)
            .Include(t => t.Comentarios)
            .Include(t => t.Anexos)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
}
