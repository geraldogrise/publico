using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoProjetos.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> b)
    {
        b.ToTable("Usuarios");
        b.HasKey(u => u.Id);

        b.Property(u => u.Nome).IsRequired().HasMaxLength(150);
        b.Property(u => u.SenhaHash).IsRequired();
        b.Property(u => u.Ativo).IsRequired();

        // Value Object Email mapeado para coluna unica.
        b.Property(u => u.Email)
            .HasConversion(
                email => email.Valor,
                valor => Email.Criar(valor))
            .HasColumnName("Email")
            .IsRequired()
            .HasMaxLength(200);

        b.HasIndex("Email").IsUnique();

        b.HasMany(u => u.Equipes)
            .WithOne(m => m.Usuario)
            .HasForeignKey(m => m.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasMany(u => u.Comentarios)
            .WithOne(c => c.Autor)
            .HasForeignKey(c => c.AutorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
