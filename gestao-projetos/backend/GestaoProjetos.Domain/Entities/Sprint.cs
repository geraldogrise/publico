using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Ciclo de trabalho (sprint) de um projeto, agrupando tarefas em um periodo.
/// </summary>
public class Sprint : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string? Objetivo { get; private set; }
    public DateTime DataInicio { get; private set; }
    public DateTime DataFim { get; private set; }
    public bool Ativa { get; private set; }

    public Guid ProjetoId { get; private set; }
    public Projeto Projeto { get; private set; } = null!;

    private readonly List<Tarefa> _tarefas = new();
    public IReadOnlyCollection<Tarefa> Tarefas => _tarefas.AsReadOnly();

    protected Sprint() { }

    public Sprint(string nome, Projeto projeto, DateTime dataInicio, DateTime dataFim, string? objetivo = null)
    {
        DefinirNome(nome);
        Projeto = projeto ?? throw new DominioException("Sprint precisa pertencer a um projeto.");
        ProjetoId = projeto.Id;
        DefinirPeriodo(dataInicio, dataFim);
        Objetivo = objetivo?.Trim();
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new DominioException("Nome da sprint e obrigatorio.");
        Nome = nome.Trim();
        MarcarAtualizacao();
    }

    public void DefinirPeriodo(DateTime inicio, DateTime fim)
    {
        if (fim <= inicio)
            throw new DominioException("Data de fim da sprint deve ser posterior a data de inicio.");
        DataInicio = inicio;
        DataFim = fim;
        MarcarAtualizacao();
    }

    public void Ativar()
    {
        Ativa = true;
        MarcarAtualizacao();
    }

    public void Encerrar()
    {
        Ativa = false;
        MarcarAtualizacao();
    }
}
