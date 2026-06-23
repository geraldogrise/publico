using GestaoProjetos.Domain.Enums;

namespace GestaoProjetos.Application.DTOs;

public record CriarTarefaRequest(
    string Titulo,
    string? Descricao,
    Guid ProjetoId,
    Guid? SprintId,
    Guid? ResponsavelId,
    PrioridadeTarefa Prioridade,
    StatusTarefa Status,
    DateTime? Prazo);

public record AtualizarTarefaRequest(
    string Titulo,
    string? Descricao,
    PrioridadeTarefa Prioridade,
    DateTime? Prazo,
    Guid? SprintId,
    Guid? ResponsavelId);

public record MoverTarefaRequest(StatusTarefa Status, int? Ordem);

public record EtiquetaDto(Guid Id, string Nome, string Cor);

public record TarefaDto(
    Guid Id,
    string Titulo,
    string? Descricao,
    StatusTarefa Status,
    PrioridadeTarefa Prioridade,
    int Ordem,
    DateTime? Prazo,
    Guid ProjetoId,
    Guid? SprintId,
    Guid? ResponsavelId,
    string? ResponsavelNome,
    IReadOnlyList<EtiquetaDto> Etiquetas,
    int TotalComentarios,
    DateTime CriadoEm);
