namespace GestaoProjetos.Application.DTOs;

public record CriarSprintRequest(
    string Nome,
    string? Objetivo,
    Guid ProjetoId,
    DateTime DataInicio,
    DateTime DataFim);

public record SprintDto(
    Guid Id,
    string Nome,
    string? Objetivo,
    Guid ProjetoId,
    DateTime DataInicio,
    DateTime DataFim,
    bool Ativa,
    int TotalTarefas);
