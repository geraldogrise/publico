using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class ProjetoConfiguration : IEntityTypeConfiguration<Projeto>
{
    public void Configure(EntityTypeBuilder<Projeto> b)
    {
        b.ToTable("Projetos");
        b.HasKey(p => p.Id);

        b.Property(p => p.Nome).IsRequired().HasMaxLength(150);
        b.Property(p => p.Descricao).HasMaxLength(1000);
        b.Property(p => p.Status).IsRequired().HasConversion<int>();

        b.HasMany(p => p.Tarefas)
            .WithOne(t => t.Projeto)
            .HasForeignKey(t => t.ProjetoId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasMany(p => p.Sprints)
            .WithOne(s => s.Projeto)
            .HasForeignKey(s => s.ProjetoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
