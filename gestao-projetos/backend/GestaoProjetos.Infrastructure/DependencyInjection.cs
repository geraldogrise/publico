using GestaoProjetos.Application.Abstractions;
using GestaoProjetos.Domain.Repositories;
using GestaoProjetos.Infrastructure.Persistence;
using GestaoProjetos.Infrastructure.Repositories;
using GestaoProjetos.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GestaoProjetos.Infrastructure;

/// <summary>
/// Registro dos adapters de Infraestrutura (EF Core, repositorios, seguranca).
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? "Data Source=gestao-projetos.db";

        services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

        // O DbContext implementa IUnitOfWork.
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());

        services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
        services.AddScoped<IProjetoRepositorio, ProjetoRepositorio>();
        services.AddScoped<ITarefaRepositorio, TarefaRepositorio>();
        services.AddScoped<ISprintRepositorio, SprintRepositorio>();
        services.AddScoped<IEquipeRepositorio, EquipeRepositorio>();

        services.AddSingleton<IServicoSenha, ServicoSenha>();

        return services;
    }
}
