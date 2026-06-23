using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Comentario feito por um usuario em uma tarefa.
/// </summary>
public class Comentario : EntidadeBase
{
    public string Texto { get; private set; } = string.Empty;

    public Guid TarefaId { get; private set; }
    public Tarefa Tarefa { get; private set; } = null!;

    public Guid AutorId { get; private set; }
    public Usuario Autor { get; private set; } = null!;

    protected Comentario() { }

    public Comentario(Tarefa tarefa, Usuario autor, string texto)
    {
        Tarefa = tarefa ?? throw new DominioException("Comentario precisa de uma tarefa.");
        TarefaId = tarefa.Id;
        Autor = autor ?? throw new DominioException("Comentario precisa de um autor.");
        AutorId = autor.Id;
        DefinirTexto(texto);
    }

    public void DefinirTexto(string texto)
    {
        if (string.IsNullOrWhiteSpace(texto))
            throw new DominioException("Texto do comentario nao pode ser vazio.");
        Texto = texto.Trim();
        MarcarAtualizacao();
    }
}
