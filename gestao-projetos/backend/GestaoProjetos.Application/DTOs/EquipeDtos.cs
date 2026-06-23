using GestaoProjetos.Domain.Enums;

namespace GestaoProjetos.Application.DTOs;

public record CriarEquipeRequest(string Nome, string? Descricao);

public record MembroDto(Guid UsuarioId, string Nome, string Email, PapelMembro Papel);

public record EquipeDto(
    Guid Id,
    string Nome,
    string? Descricao,
    IReadOnlyList<MembroDto> Membros,
    int TotalProjetos);
