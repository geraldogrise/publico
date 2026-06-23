using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.UseCases.Sprints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoProjetos.Api.Controllers;

[ApiController]
[Route("api/sprints")]
public class SprintsController : ControllerBase
{
    private readonly ISprintService _sprints;

    public SprintsController(ISprintService sprints) => _sprints = sprints;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<SprintDto>>> ListarPorProjeto([FromQuery] Guid projetoId, CancellationToken ct) =>
        Ok(await _sprints.ListarPorProjetoAsync(projetoId, ct));

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<SprintDto>> Criar([FromBody] CriarSprintRequest request, CancellationToken ct)
    {
        var dto = await _sprints.CriarAsync(request, ct);
        return Ok(dto);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        await _sprints.RemoverAsync(id, ct);
        return NoContent();
    }
}
