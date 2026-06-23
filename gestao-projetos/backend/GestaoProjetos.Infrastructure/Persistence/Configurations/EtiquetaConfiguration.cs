using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class EtiquetaConfiguration : IEntityTypeConfiguration<Etiqueta>
{
    public void Configure(EntityTypeBuilder<Etiqueta> b)
    {
        b.ToTable("Etiquetas");
        b.HasKey(e => e.Id);
        b.Property(e => e.Nome).IsRequired().HasMaxLength(80);
        b.Property(e => e.Cor).IsRequired().HasMaxLength(20);
        b.HasIndex(e => e.Nome).IsUnique();
    }
}
