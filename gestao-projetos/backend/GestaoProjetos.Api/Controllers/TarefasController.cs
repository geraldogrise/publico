using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.UseCases.Tarefas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoProjetos.Api.Controllers;

[ApiController]
[Route("api/tarefas")]
public class TarefasController : ControllerBase
{
    private readonly ITarefaService _tarefas;

    public TarefasController(ITarefaService tarefas) => _tarefas = tarefas;

    /// <summary>Lista as tarefas de um projeto (para montar o board Kanban).</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TarefaDto>>> ListarPorProjeto([FromQuery] Guid projetoId, CancellationToken ct) =>
        Ok(await _tarefas.ListarPorProjetoAsync(projetoId, ct));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TarefaDto>> Obter(Guid id, CancellationToken ct) =>
        Ok(await _tarefas.ObterAsync(id, ct));

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TarefaDto>> Criar([FromBody] CriarTarefaRequest request, CancellationToken ct)
    {
        var dto = await _tarefas.CriarAsync(request, ct);
        return CreatedAtAction(nameof(Obter), new { id = dto.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<TarefaDto>> Atualizar(Guid id, [FromBody] AtualizarTarefaRequest request, CancellationToken ct) =>
        Ok(await _tarefas.AtualizarAsync(id, request, ct));

    /// <summary>Move a tarefa entre colunas do board (altera status/ordem).</summary>
    [HttpPatch("{id:guid}/mover")]
    [Authorize]
    public async Task<ActionResult<TarefaDto>> Mover(Guid id, [FromBody] MoverTarefaRequest request, CancellationToken ct) =>
        Ok(await _tarefas.MoverAsync(id, request, ct));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        await _tarefas.RemoverAsync(id, ct);
        return NoContent();
    }
}
