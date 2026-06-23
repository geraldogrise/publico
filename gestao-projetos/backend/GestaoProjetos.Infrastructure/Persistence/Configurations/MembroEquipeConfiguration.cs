using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class MembroEquipeConfiguration : IEntityTypeConfiguration<MembroEquipe>
{
    public void Configure(EntityTypeBuilder<MembroEquipe> b)
    {
        b.ToTable("MembrosEquipe");
        b.HasKey(m => m.Id);

        b.Property(m => m.Papel).IsRequired().HasConversion<int>();

        // Garante que um usuario nao seja adicionado duas vezes na mesma equipe.
        b.HasIndex(m => new { m.EquipeId, m.UsuarioId }).IsUnique();
    }
}
