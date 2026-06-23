using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Projeto pertencente a uma equipe. Agrega tarefas e sprints.
/// </summary>
public class Projeto : EntidadeBase
{
    public string Nome { get; private set; } = string.Empty;
    public string? Descricao { get; private set; }
    public StatusProjeto Status { get; private set; } = StatusProjeto.Planejado;
    public DateTime? DataInicio { get; private set; }
    public DateTime? DataFimPrevista { get; private set; }

    public Guid EquipeId { get; private set; }
    public Equipe Equipe { get; private set; } = null!;

    private readonly List<Tarefa> _tarefas = new();
    public IReadOnlyCollection<Tarefa> Tarefas => _tarefas.AsReadOnly();

    private readonly List<Sprint> _sprints = new();
    public IReadOnlyCollection<Sprint> Sprints => _sprints.AsReadOnly();

    protected Projeto() { }

    public Projeto(string nome, Equipe equipe, string? descricao = null,
        DateTime? dataInicio = null, DateTime? dataFimPrevista = null)
    {
        DefinirNome(nome);
        Equipe = equipe ?? throw new DominioException("Projeto precisa pertencer a uma equipe.");
        EquipeId = equipe.Id;
        Descricao = descricao?.Trim();
        DefinirDatas(dataInicio, dataFimPrevista);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new DominioException("Nome do projeto e obrigatorio.");
        Nome = nome.Trim();
        MarcarAtualizacao();
    }

    public void AtualizarDescricao(string? descricao)
    {
        Descricao = descricao?.Trim();
        MarcarAtualizacao();
    }

    public void DefinirDatas(DateTime? inicio, DateTime? fimPrevista)
    {
        if (inicio.HasValue && fimPrevista.HasValue && fimPrevista < inicio)
            throw new DominioException("Data de fim prevista nao pode ser anterior a data de inicio.");
        DataInicio = inicio;
        DataFimPrevista = fimPrevista;
        MarcarAtualizacao();
    }

    public void AlterarStatus(StatusProjeto status)
    {
        Status = status;
        MarcarAtualizacao();
    }
}
