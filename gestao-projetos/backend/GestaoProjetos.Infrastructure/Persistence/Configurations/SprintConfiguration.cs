using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class SprintConfiguration : IEntityTypeConfiguration<Sprint>
{
    public void Configure(EntityTypeBuilder<Sprint> b)
    {
        b.ToTable("Sprints");
        b.HasKey(s => s.Id);

        b.Property(s => s.Nome).IsRequired().HasMaxLength(150);
        b.Property(s => s.Objetivo).HasMaxLength(500);
        b.Property(s => s.DataInicio).IsRequired();
        b.Property(s => s.DataFim).IsRequired();

        b.HasMany(s => s.Tarefas)
            .WithOne(t => t.Sprint)
            .HasForeignKey(t => t.SprintId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
