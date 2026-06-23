namespace GestaoProjetos.Domain.Common;

/// <summary>
/// Raiz comum para todas as entidades do dominio. Fornece identidade e
/// metadados de auditoria. Mantida livre de qualquer dependencia de framework.
/// </summary>
public abstract class EntidadeBase
{
    public Guid Id { get; protected set; } = Guid.NewGuid();

    public DateTime CriadoEm { get; protected set; } = DateTime.UtcNow;

    public DateTime? AtualizadoEm { get; protected set; }

    protected void MarcarAtualizacao() => AtualizadoEm = DateTime.UtcNow;
}
