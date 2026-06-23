namespace GestaoProjetos.Application.DTOs;

public record LoginRequest(string Email, string Senha);

public record LoginResponse(string Token, DateTime ExpiraEm, UsuarioDto Usuario);

public record UsuarioDto(Guid Id, string Nome, string Email);
