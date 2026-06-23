using GestaoProjetos.Domain.Common;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Domain.Exceptions;

namespace GestaoProjetos.Domain.Entities;

/// <summary>
/// Tarefa (cartao do board Kanban). Pertence a um projeto, opcionalmente a uma
/// sprint, possui status/prioridade, comentarios, etiquetas e anexos.
/// </summary>
public class Tarefa : EntidadeBase
{
    public string Titulo { get; private set; } = string.Empty;
    public string? Descricao { get; private set; }
    public StatusTarefa Status { get; private set; } = StatusTarefa.Backlog;
    public PrioridadeTarefa Prioridade { get; private set; } = PrioridadeTarefa.Media;
    public int Ordem { get; private set; }
    public DateTime? Prazo { get; private set; }

    public Guid ProjetoId { get; private set; }
    public Projeto Projeto { get; private set; } = null!;

    public Guid? SprintId { get; private set; }
    public Sprint? Sprint { get; private set; }

    public Guid? ResponsavelId { get; private set; }
    public Usuario? Responsavel { get; private set; }

    private readonly List<Comentario> _comentarios = new();
    public IReadOnlyCollection<Comentario> Comentarios => _comentarios.AsReadOnly();

    private readonly List<Etiqueta> _etiquetas = new();
    public IReadOnlyCollection<Etiqueta> Etiquetas => _etiquetas.AsReadOnly();

    private readonly List<Anexo> _anexos = new();
    public IReadOnlyCollection<Anexo> Anexos => _anexos.AsReadOnly();

    protected Tarefa() { }

    public Tarefa(string titulo, Projeto projeto, string? descricao = null,
        PrioridadeTarefa prioridade = PrioridadeTarefa.Media,
        StatusTarefa status = StatusTarefa.Backlog)
    {
        DefinirTitulo(titulo);
        Projeto = projeto ?? throw new DominioException("Tarefa precisa pertencer a um projeto.");
        ProjetoId = projeto.Id;
        Descricao = descricao?.Trim();
        Prioridade = prioridade;
        Status = status;
    }

    public void DefinirTitulo(string titulo)
    {
        if (string.IsNullOrWhiteSpace(titulo))
            throw new DominioException("Titulo da tarefa e obrigatorio.");
        Titulo = titulo.Trim();
        MarcarAtualizacao();
    }

    public void AtualizarDescricao(string? descricao)
    {
        Descricao = descricao?.Trim();
        MarcarAtualizacao();
    }

    public void MoverPara(StatusTarefa status, int? ordem = null)
    {
        Status = status;
        if (ordem.HasValue) Ordem = ordem.Value;
        MarcarAtualizacao();
    }

    public void DefinirPrioridade(PrioridadeTarefa prioridade)
    {
        Prioridade = prioridade;
        MarcarAtualizacao();
    }

    public void DefinirPrazo(DateTime? prazo)
    {
        Prazo = prazo;
        MarcarAtualizacao();
    }

    public void AtribuirA(Usuario? responsavel)
    {
        Responsavel = responsavel;
        ResponsavelId = responsavel?.Id;
        MarcarAtualizacao();
    }

    public void AssociarSprint(Sprint? sprint)
    {
        Sprint = sprint;
        SprintId = sprint?.Id;
        MarcarAtualizacao();
    }

    public Comentario AdicionarComentario(Usuario autor, string texto)
    {
        var comentario = new Comentario(this, autor, texto);
        _comentarios.Add(comentario);
        MarcarAtualizacao();
        return comentario;
    }

    public void AdicionarEtiqueta(Etiqueta etiqueta)
    {
        if (etiqueta is null)
            throw new DominioException("Etiqueta e obrigatoria.");
        if (_etiquetas.Any(e => e.Id == etiqueta.Id)) return;
        _etiquetas.Add(etiqueta);
        MarcarAtualizacao();
    }

    public void RemoverEtiqueta(Etiqueta etiqueta)
    {
        _etiquetas.RemoveAll(e => e.Id == etiqueta.Id);
        MarcarAtualizacao();
    }
}
