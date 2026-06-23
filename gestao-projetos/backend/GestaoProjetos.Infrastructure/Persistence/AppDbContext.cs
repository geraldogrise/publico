using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GestaoProjetos.Infrastructure.Persistence;

/// <summary>
/// DbContext (adapter de persistencia). Implementa o port IUnitOfWork
/// para que a camada de Aplicacao confirme transacoes sem conhecer o EF Core.
/// </summary>
public class AppDbContext : DbContext, IUnitOfWork
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Equipe> Equipes => Set<Equipe>();
    public DbSet<MembroEquipe> MembrosEquipe => Set<MembroEquipe>();
    public DbSet<Projeto> Projetos => Set<Projeto>();
    public DbSet<Sprint> Sprints => Set<Sprint>();
    public DbSet<Tarefa> Tarefas => Set<Tarefa>();
    public DbSet<Comentario> Comentarios => Set<Comentario>();
    public DbSet<Etiqueta> Etiquetas => Set<Etiqueta>();
    public DbSet<Anexo> Anexos => Set<Anexo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public Task<int> SalvarAlteracoesAsync(CancellationToken ct = default) => SaveChangesAsync(ct);
}
