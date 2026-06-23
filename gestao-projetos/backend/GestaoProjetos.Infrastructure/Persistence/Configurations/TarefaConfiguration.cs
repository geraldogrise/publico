using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class TarefaConfiguration : IEntityTypeConfiguration<Tarefa>
{
    public void Configure(EntityTypeBuilder<Tarefa> b)
    {
        b.ToTable("Tarefas");
        b.HasKey(t => t.Id);

        b.Property(t => t.Titulo).IsRequired().HasMaxLength(200);
        b.Property(t => t.Descricao).HasMaxLength(2000);
        b.Property(t => t.Status).IsRequired().HasConversion<int>();
        b.Property(t => t.Prioridade).IsRequired().HasConversion<int>();
        b.Property(t => t.Ordem).IsRequired();

        b.HasOne(t => t.Responsavel)
            .WithMany()
            .HasForeignKey(t => t.ResponsavelId)
            .OnDelete(DeleteBehavior.SetNull);

        b.HasMany(t => t.Comentarios)
            .WithOne(c => c.Tarefa)
            .HasForeignKey(c => c.TarefaId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasMany(t => t.Anexos)
            .WithOne(a => a.Tarefa)
            .HasForeignKey(a => a.TarefaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relacionamento many-to-many Tarefa <-> Etiqueta (tabela de juncao implicita).
        b.HasMany(t => t.Etiquetas)
            .WithMany(e => e.Tarefas)
            .UsingEntity(j => j.ToTable("TarefaEtiquetas"));
    }
}
