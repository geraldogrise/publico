using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class EquipeConfiguration : IEntityTypeConfiguration<Equipe>
{
    public void Configure(EntityTypeBuilder<Equipe> b)
    {
        b.ToTable("Equipes");
        b.HasKey(e => e.Id);

        b.Property(e => e.Nome).IsRequired().HasMaxLength(150);
        b.Property(e => e.Descricao).HasMaxLength(500);

        b.HasMany(e => e.Membros)
            .WithOne(m => m.Equipe)
            .HasForeignKey(m => m.EquipeId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasMany(e => e.Projetos)
            .WithOne(p => p.Equipe)
            .HasForeignKey(p => p.EquipeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
