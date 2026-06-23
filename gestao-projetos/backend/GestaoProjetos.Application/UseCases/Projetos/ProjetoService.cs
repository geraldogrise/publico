using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.Exceptions;
using GestaoProjetos.Application.Mapeamento;
using GestaoProjetos.Domain.Entities;
using GestaoProjetos.Domain.Repositories;

namespace GestaoProjetos.Application.UseCases.Projetos;

/// <summary>
/// Casos de uso de CRUD de Projetos. Orquestra repositorios e Unit of Work.
/// </summary>
public class ProjetoService : IProjetoService
{
    private readonly IProjetoRepositorio _projetos;
    private readonly IEquipeRepositorio _equipes;
    private readonly IUnitOfWork _uow;

    public ProjetoService(IProjetoRepositorio projetos, IEquipeRepositorio equipes, IUnitOfWork uow)
    {
        _projetos = projetos;
        _equipes = equipes;
        _uow = uow;
    }

    public async Task<IReadOnlyList<ProjetoDto>> ListarAsync(CancellationToken ct = default)
    {
        var projetos = await _projetos.ListarComEquipeAsync(ct);
        return projetos.Select(p => p.ParaDto()).ToList();
    }

    public async Task<ProjetoDto> ObterAsync(Guid id, CancellationToken ct = default)
    {
        var projeto = await _projetos.ObterComTarefasAsync(id, ct)
            ?? throw new NaoEncontradoException("Projeto", id);
        return projeto.ParaDto();
    }

    public async Task<ProjetoDto> CriarAsync(CriarProjetoRequest request, CancellationToken ct = default)
    {
        var equipe = await _equipes.ObterPorIdAsync(request.EquipeId, ct)
            ?? throw new NaoEncontradoException("Equipe", request.EquipeId);

        var projeto = new Projeto(
            request.Nome,
            equipe,
            request.Descricao,
            request.DataInicio,
            request.DataFimPrevista);

        await _projetos.AdicionarAsync(projeto, ct);
        await _uow.SalvarAlteracoesAsync(ct);
        return projeto.ParaDto();
    }

    public async Task<ProjetoDto> AtualizarAsync(Guid id, AtualizarProjetoRequest request, CancellationToken ct = default)
    {
        var projeto = await _projetos.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Projeto", id);

        projeto.DefinirNome(request.Nome);
        projeto.AtualizarDescricao(request.Descricao);
        projeto.AlterarStatus(request.Status);
        projeto.DefinirDatas(request.DataInicio, request.DataFimPrevista);

        _projetos.Atualizar(projeto);
        await _uow.SalvarAlteracoesAsync(ct);
        return projeto.ParaDto();
    }

    public async Task RemoverAsync(Guid id, CancellationToken ct = default)
    {
        var projeto = await _projetos.ObterPorIdAsync(id, ct)
            ?? throw new NaoEncontradoException("Projeto", id);
        _projetos.Remover(projeto);
        await _uow.SalvarAlteracoesAsync(ct);
    }
}
