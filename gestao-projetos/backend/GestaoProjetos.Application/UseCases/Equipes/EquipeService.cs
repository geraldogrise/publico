using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Application.Mapeamento;
using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;

namespace GestaoProjetos.Application.UseCases.Equipes;

/// <summary>
/// Casos de uso de Equipes.
/// </summary>
public class EquipeService : IEquipeService
{
    private readonly IEquipeRepositorio _equipes;
    private readonly IUnitOfWork _uow;

    public EquipeService(IEquipeRepositorio equipes, IUnitOfWork uow)
    {
        _equipes = equipes;
        _uow = uow;
    }

    public async Task<IReadOnlyList<EquipeDto>> ListarAsync(CancellationToken ct = default)
    {
        var equipes = await _equipes.ListarComMembrosAsync(ct);
        return equipes.Select(e => e.ParaDto()).ToList();
    }

    public async Task<EquipeDto> ObterAsync(Guid id, CancellationToken ct = default)
    {
        var equipe = await _equipes.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Equipe", id);
        return equipe.ParaDto();
    }

    public async Task<EquipeDto> CriarAsync(CriarEquipeRequest request, CancellationToken ct = default)
    {
        var equipe = new Equipe(request.Nome, request.Descricao);
        await _equipes.AdicionarAsync(equipe, ct);
        await _uow.SalvarAlteracoesAsync(ct);
        return equipe.ParaDto();
    }

    public async Task RemoverAsync(Guid id, CancellationToken ct = default)
    {
        var equipe = await _equipes.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Equipe", id);
        _equipes.Remover(equipe);
        await _uow.SalvarAlteracoesAsync(ct);
    }
}
