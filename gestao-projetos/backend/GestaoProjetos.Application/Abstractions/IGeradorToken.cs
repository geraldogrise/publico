using GestaoProjetos.Domain.Entities;

namespace GestaoProjetos.Application.Abstractions;

/// <summary>
/// Port para emissao de tokens JWT. Implementado na camada de API/Infra.
/// </summary>
public interface IGeradorToken
{
    (string Token, DateTime ExpiraEm) GerarToken(Usuario usuario);
}
