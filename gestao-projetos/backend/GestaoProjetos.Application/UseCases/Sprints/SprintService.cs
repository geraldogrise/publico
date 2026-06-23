using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Application.Mapeamento;
using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;

namespace GestaoProjetos.Application.UseCases.Sprints;

/// <summary>
/// Casos de uso de Sprints.
/// </summary>
public class SprintService : ISprintService
{
    private readonly ISprintRepositorio _sprints;
    private readonly IProjetoRepositorio _projetos;
    private readonly IUnitOfWork _uow;

    public SprintService(ISprintRepositorio sprints, IProjetoRepositorio projetos, IUnitOfWork uow)
    {
        _sprints = sprints;
        _projetos = projetos;
        _uow = uow;
    }

    public async Task<IReadOnlyList<SprintDto>> ListarPorProjetoAsync(Guid projetoId, CancellationToken ct = default)
    {
        var sprints = await _sprints.ListarPorProjetoAsync(projetoId, ct);
        return sprints.Select(s => s.ParaDto()).ToList();
    }

    public async Task<SprintDto> CriarAsync(CriarSprintRequest request, CancellationToken ct = default)
    {
        var projeto = await _projetos.ObterPorIdAsync(request.ProjetoId, ct)
            ?? throw new NaoEncontradoException("Projeto", request.ProjetoId);

        var sprint = new Sprint(request.Nome, projeto, request.DataInicio, request.DataFim, request.Objetivo);

        await _sprints.AdicionarAsync(sprint, ct);
        await _uow.SalvarAlteracoesAsync(ct);
        return sprint.ParaDto();
    }

    public async Task RemoverAsync(Guid id, CancellationToken ct = default)
    {
        var sprint = await _sprints.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Sprint", id);
        _sprints.Remover(sprint);
        await _uow.SalvarAlteracoesAsync(ct);
    }
}
