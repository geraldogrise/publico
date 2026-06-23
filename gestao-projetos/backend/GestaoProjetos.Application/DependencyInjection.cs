using GestaoProjetos.Application.UseCases.Auth;
using GestaoProjetos.Application.UseCases.Equipes;
using GestaoProjetos.Application.UseCases.Projetos;
using GestaoProjetos.Application.UseCases.Sprints;
using GestaoProjetos.Application.UseCases.Tarefas;
using Microsoft.Extensions.DependencyInjection;

namespace GestaoProjetos.Application;

/// <summary>
/// Registro dos casos de uso da camada de Aplicacao no container de DI.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProjetoService, ProjetoService>();
        services.AddScoped<ITarefaService, TarefaService>();
        services.AddScoped<ISprintService, SprintService>();
        services.AddScoped<IEquipeService, EquipeService>();
        return services;
    }
}
