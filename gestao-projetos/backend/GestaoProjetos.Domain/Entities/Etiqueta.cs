using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Etiqueta (tag) que pode ser associada a varias tarefas (many-to-many).
/// </summary>
public class Etiqueta : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string Cor { get; private set; } = "#888888";

    private readonly List<Tarefa> _tarefas = new();
    public IReadOnlyCollection<Tarefa> Tarefas => _tarefas.AsReadOnly();

    protected Etiqueta() { }

    public Etiqueta(string nome, string cor = "#888888")
    {
        DefinirNome(nome);
        DefinirCor(cor);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new DominioException("Nome da etiqueta e obrigatorio.");
        Nome = nome.Trim();
        MarcarAtualizacao();
    }

    public void DefinirCor(string cor)
    {
        if (string.IsNullOrWhiteSpace(cor))
            throw new DominioException("Cor da etiqueta e obrigatoria.");
        Cor = cor.Trim();
        MarcarAtualizacao();
    }
}
