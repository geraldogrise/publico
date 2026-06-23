using GestaoProjetos.Application.Abstractions;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace GestaoProjetos.Tests.Infraestrutura;

/// <summary>
/// WebApplicationFactory que substitui o SQLite por EF Core InMemory e
/// executa o seed, isolando cada execucao de teste. Usa um
/// <see cref="InMemoryDatabaseRoot"/> compartilhado para que o seed (feito num
/// provider auxiliar) seja visivel pelo servidor de teste.
/// </summary>
public class FabricaApiTeste : WebApplicationFactory<Program>
{
    private readonly string _nomeBanco = $"TesteDb_{Guid.NewGuid()}";
    private static readonly InMemoryDatabaseRoot _root = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Remove TODAS as registracoes de EF Core do provider real (SQLite),
            // incluindo IDbContextOptionsConfiguration<> introduzido no EF Core 9.
            var remover = services.Where(d =>
                d.ServiceType == typeof(AppDbContext) ||
                (d.ServiceType.FullName?.Contains("DbContextOptions") ?? false))
                .ToList();
            foreach (var d in remover)
                services.Remove(d);

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(_nomeBanco, _root));

            // Constroi e popula o banco em memoria (mesmo store via _root).
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var senha = scope.ServiceProvider.GetRequiredService<IServicoSenha>();
            DbInitializer.InicializarAsync(ctx, senha).GetAwaiter().GetResult();
        });
    }
}
