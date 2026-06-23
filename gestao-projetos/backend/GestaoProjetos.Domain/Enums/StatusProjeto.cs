namespace GestaoProjetos.Domain.Enums;

/// <summary>
/// Estado de ciclo de vida de um projeto.
/// </summary>
public enum StatusProjeto
{
    Planejado = 0,
    EmAndamento = 1,
    Pausado = 2,
    Concluido = 3,
    Cancelado = 4
}
