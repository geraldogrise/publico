using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Equipe que reune usuarios (via MembroEquipe) e e dona de projetos.
/// </summary>
public class Equipe : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string? Descricao { get; private set; }

    private readonly List<MembroEquipe> _membros = new();
    public IReadOnlyCollection<MembroEquipe> Membros => _membros.AsReadOnly();

    private readonly List<Projeto> _projetos = new();
    public IReadOnlyCollection<Projeto> Projetos => _projetos.AsReadOnly();

    protected Equipe() { }

    public Equipe(string nome, string? descricao = null)
    {
        DefinirNome(nome);
        Descricao = descricao?.Trim();
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new DominioException("Nome da equipe e obrigatorio.");
        Nome = nome.Trim();
        MarcarAtualizacao();
    }

    public void AtualizarDescricao(string? descricao)
    {
        Descricao = descricao?.Trim();
        MarcarAtualizacao();
    }

    public MembroEquipe AdicionarMembro(Usuario usuario, PapelMembro papel = PapelMembro.Membro)
    {
        if (usuario is null)
            throw new DominioException("Usuario e obrigatorio para adicionar a equipe.");

        if (_membros.Any(m => m.UsuarioId == usuario.Id))
            throw new DominioException("Usuario ja pertence a esta equipe.");

        var membro = new MembroEquipe(this, usuario, papel);
        _membros.Add(membro);
        MarcarAtualizacao();
        return membro;
    }
}
