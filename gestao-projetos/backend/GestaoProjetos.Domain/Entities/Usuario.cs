using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Exceptions;
using GestaoProjetos.Domain.ValueObjects;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Usuario do sistema. Pode ser membro de varias equipes e autor de comentarios.
/// </summary>
public class Usuario : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public Email Email { get; private set; } = null!;
    public string SenhaHash { get; private set; } = string.Empty;
    public bool Ativo { get; private set; } = true;

    // Relacionamentos
    private readonly List<MembroEquipe> _equipes = new();
    public IReadOnlyCollection<MembroEquipe> Equipes => _equipes.AsReadOnly();

    private readonly List<Comentario> _comentarios = new();
    public IReadOnlyCollection<Comentario> Comentarios => _comentarios.AsReadOnly();

    // EF Core
    protected Usuario() { }

    public Usuario(string nome, Email email, string senhaHash)
    {
        DefinirNome(nome);
        Email = email ?? throw new DominioException("E-mail e obrigatorio.");
        DefinirSenhaHash(senhaHash);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new DominioException("Nome do usuario e obrigatorio.");
        Nome = nome.Trim();
        MarcarAtualizacao();
    }

    public void DefinirSenhaHash(string senhaHash)
    {
        if (string.IsNullOrWhiteSpace(senhaHash))
            throw new DominioException("Hash de senha e obrigatorio.");
        SenhaHash = senhaHash;
        MarcarAtualizacao();
    }

    public void Desativar()
    {
        Ativo = false;
        MarcarAtualizacao();
    }
}
