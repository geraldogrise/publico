using GestaoProjetos.Domain.Enums;

namespace GestaoProjetos.Application.DTOs;

public record CriarProjetoRequest(
    string Nome,
    string? Descricao,
    Guid EquipeId,
    DateTime? DataInicio,
    DateTime? DataFimPrevista);

public record AtualizarProjetoRequest(
    string Nome,
    string? Descricao,
    StatusProjeto Status,
    DateTime? DataInicio,
    DateTime? DataFimPrevista);

public record ProjetoDto(
    Guid Id,
    string Nome,
    string? Descricao,
    StatusProjeto Status,
    Guid EquipeId,
    string? EquipeNome,
    DateTime? DataInicio,
    DateTime? DataFimPrevista,
    int TotalTarefas,
    DateTime CriadoEm);
