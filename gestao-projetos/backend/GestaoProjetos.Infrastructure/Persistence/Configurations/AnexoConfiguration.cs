using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class AnexoConfiguration : IEntityTypeConfiguration<Anexo>
{
    public void Configure(EntityTypeBuilder<Anexo> b)
    {
        b.ToTable("Anexos");
        b.HasKey(a => a.Id);
        b.Property(a => a.NomeArquivo).IsRequired().HasMaxLength(255);
        b.Property(a => a.Url).IsRequired().HasMaxLength(1000);
        b.Property(a => a.TamanhoBytes).IsRequired();
    }
}
