using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Application.Mapeamento;
using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;

namespace GestaoProjetos.Application.UseCases.Tarefas;

/// <summary>
/// Casos de uso de CRUD e movimentacao (Kanban) de Tarefas.
/// </summary>
public class TarefaService : ITarefaService
{
    private readonly ITarefaRepositorio _tarefas;
    private readonly IProjetoRepositorio _projetos;
    private readonly ISprintRepositorio _sprints;
    private readonly IUsuarioRepositorio _usuarios;
    private readonly IUnitOfWork _uow;

    public TarefaService(
        ITarefaRepositorio tarefas,
        IProjetoRepositorio projetos,
        ISprintRepositorio sprints,
        IUsuarioRepositorio usuarios,
        IUnitOfWork uow)
    {
        _tarefas = tarefas;
        _projetos = projetos;
        _sprints = sprints;
        _usuarios = usuarios;
        _uow = uow;
    }

    public async Task<IReadOnlyList<TarefaDto>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default)
    {
        var tarefas = await _tarefas.ListarPorProjetoAsync(projetoId, ct);
        return tarefas.Select(t => t.ParaDto()).ToList();
    }

    public async Task<TarefaDto> ObterAsync(Guid id, CancellationToken ct = default)
    {
        var tarefa = await _tarefas.ObterCompletaAsync(id, ct)
            ?? throw new NaoEncontradoException("Tarefa", id);
        return tarefa.ParaDto();
    }

    public async Task<TarefaDto> CriarAsync(CriarTarefaRequest request, CancellationToken ct = default)
    {
        var projeto = await _projetos.ObterPorIdAsync(request.ProjetoId, ct)
            ?? throw new NaoEncontradoException("Projeto", request.ProjetoId);

        var tarefa = new Tarefa(
            request.Titulo,
            projeto,
            request.Descricao,
            request.Prioridade,
            request.Status);

        if (request.Prazo.HasValue)
            tarefa.DefinirPrazo(request.Prazo);

        await AssociarSprint(tarefa, request.SprintId, ct);
        await AtribuirResponsavel(tarefa, request.ResponsavelId, ct);

        await _tarefas.AdicionarAsync(tarefa, ct);
        await _uow.SalvarAlteracoesAsync(ct);
        return tarefa.ParaDto();
    }

    public async Task<TarefaDto> AtualizarAsync(Guid id, AtualizarTarefaRequest request, CancellationToken ct = default)
    {
        var tarefa = await _tarefas.ObterCompletaAsync(id, ct)
            ?? throw new NaoEncontradoException("Tarefa", id);

        tarefa.DefinirTitulo(request.Titulo);
        tarefa.AtualizarDescricao(request.Descricao);
        tarefa.DefinirPrioridade(request.Prioridade);
        tarefa.DefinirPrazo(request.Prazo);

        await AssociarSprint(tarefa, request.SprintId, ct);
        await AtribuirResponsavel(tarefa, request.ResponsavelId, ct);

        _tarefas.Atualizar(tarefa);
        await _uow.SalvarAlteracoesAsync(ct);
        return tarefa.ParaDto();
    }

    public async Task<TarefaDto> MoverAsync(Guid id, MoverTarefaRequest request, CancellationToken ct = default)
    {
        var tarefa = await _tarefas.ObterCompletaAsync(id, ct)
            ?? throw new NaoEncontradoException("Tarefa", id);

        tarefa.MoverPara(request.Status, request.Ordem);
        _tarefas.Atualizar(tarefa);
        await _uow.SalvarAlteracoesAsync(ct);
        return tarefa.ParaDto();
    }

    public async Task RemoverAsync(Guid id, CancellationToken ct = default)
    {
        var tarefa = await _tarefas.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Tarefa", id);
        _tarefas.Remover(tarefa);
        await _uow.SalvarAlteracoesAsync(ct);
    }

    private async Task AssociarSprint(Tarefa tarefa, Guid? sprintId, CancellationToken ct)
    {
        if (!sprintId.HasValue)
        {
            tarefa.AssociarSprint(null);
            return;
        }
        var sprint = await _sprints.ObterPorIdAsync(sprintId.Value, ct)
            ?? throw new NaoEncontradoException("Sprint", sprintId.Value);
        tarefa.AssociarSprint(sprint);
    }

    private async Task AtribuirResponsavel(Tarefa tarefa, Guid? responsavelId, CancellationToken ct)
    {
        if (!responsavelId.HasValue)
        {
            tarefa.AtribuirA(null);
            return;
        }
        var usuario = await _usuarios.ObterPorIdAsync(responsavelId.Value, ct)
            ?? throw new NaoEncontradoException("Usuario", responsavelId.Value);
        tarefa.AtribuirA(usuario);
    }
}
