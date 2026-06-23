using CineGraph.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CineGraph.Api.Data;

/// <summary>Contexto EF Core do CineGraph (SQLite).</summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<Person> People => Set<Person>();
    public DbSet<CastMember> CastMembers => Set<CastMember>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Movie>()
            .HasMany(m => m.Genres)
            .WithMany(g => g.Movies);

        modelBuilder.Entity<CastMember>()
            .HasOne(c => c.Movie)
            .WithMany(m => m.Cast)
            .HasForeignKey(c => c.MovieId);

        modelBuilder.Entity<CastMember>()
            .HasOne(c => c.Person)
            .WithMany(p => p.Roles)
            .HasForeignKey(c => c.PersonId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Movie)
            .WithMany(m => m.Reviews)
            .HasForeignKey(r => r.MovieId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
