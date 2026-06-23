using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Tabela de associacao (entidade de juncao) entre Usuario e Equipe,
/// carregando o papel do usuario na equipe.
/// </summary>
public class MembroEquipe : EntidadeBase
{
    public Guid EquipeId { get; private set; }
    public Equipe Equipe { get; private set; } = null!;

    public Guid UsuarioId { get; private set; }
    public Usuario Usuario { get; private set; } = null!;

    public PapelMembro Papel { get; private set; }

    protected MembroEquipe() { }

    public MembroEquipe(Equipe equipe, Usuario usuario, PapelMembro papel)
    {
        Equipe = equipe ?? throw new DominioException("Equipe e obrigatoria.");
        Usuario = usuario ?? throw new DominioException("Usuario e obrigatorio.");
        EquipeId = equipe.Id;
        UsuarioId = usuario.Id;
        Papel = papel;
    }

    public void AlterarPapel(PapelMembro papel)
    {
        Papel = papel;
        MarcarAtualizacao();
    }
}
