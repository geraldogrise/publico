using System.Net;
using System.Text.Json;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Api.Middleware;

/// <summary>
/// Converte excecoes de dominio/aplicacao em respostas HTTP padronizadas
/// (ProblemDetails simplificado).
/// </summary>
public class TratamentoExcecoesMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TratamentoExcecoesMiddleware> _logger;

    public TratamentoExcecoesMiddleware(RequestDelegate next, ILogger<TratamentoExcecoesMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await TratarAsync(context, ex);
        }
    }

    private async Task TratarAsync(HttpContext context, Exception ex)
    {
        var (status, titulo) = ex switch
        {
            NaoEncontradoException => (HttpStatusCode.NotFound, "Recurso nao encontrado"),
            AutenticacaoException => (HttpStatusCode.Unauthorized, "Falha de autenticacao"),
            DominioException => (HttpStatusCode.BadRequest, "Regra de negocio violada"),
            _ => (HttpStatusCode.InternalServerError, "Erro interno do servidor")
        };

        if (status == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Erro nao tratado na requisicao {Path}", context.Request.Path);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var payload = JsonSerializer.Serialize(new
        {
            status = (int)status,
            title = titulo,
            detail = ex.Message
        });

        await context.Response.WriteAsync(payload);
    }
}
