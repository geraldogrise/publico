using GestaoProjetos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class ComentarioConfiguration : IEntityTypeConfiguration<Comentario>
{
    public void Configure(EntityTypeBuilder<Comentario> b)
    {
        b.ToTable("Comentarios");
        b.HasKey(c => c.Id);
        b.Property(c => c.Texto).IsRequired().HasMaxLength(2000);
    }
}
