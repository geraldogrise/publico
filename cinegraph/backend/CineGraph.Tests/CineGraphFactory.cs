using CineGraph.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace CineGraph.Tests;

/// <summary>
/// Fabrica de testes: substitui o SQLite por EF Core InMemory (factory) e
/// popula o catalogo. Usa um InMemoryDatabaseRoot compartilhado para que o seed
/// fique visivel ao servidor GraphQL.
/// </summary>
public class CineGraphFactory : WebApplicationFactory<Program>
{
    private static readonly InMemoryDatabaseRoot _root = new();
    private readonly string _dbName = $"cinegraph_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Remove o registro do provider real (SQLite) do DbContext/Factory.
            var remover = services
                .Where(d => d.ServiceType.FullName?.Contains("DbContext") ?? false)
                .ToList();
            foreach (var d in remover)
                services.Remove(d);

            services.AddDbContextFactory<AppDbContext>(o => o.UseInMemoryDatabase(_dbName, _root));

            // Seed inicial no mesmo store (via _root).
            var sp = services.BuildServiceProvider();
            var factory = sp.GetRequiredService<IDbContextFactory<AppDbContext>>();
            using var ctx = factory.CreateDbContext();
            DbSeeder.SeedAsync(ctx).GetAwaiter().GetResult();
        });
    }
}
