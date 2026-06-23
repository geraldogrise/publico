using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.UseCases.Equipes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoProjetos.Api.Controllers;

[ApiController]
[Route("api/equipes")]
public class EquipesController : ControllerBase
{
    private readonly IEquipeService _equipes;

    public EquipesController(IEquipeService equipes) => _equipes = equipes;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<EquipeDto>>> Listar(CancellationToken ct) =>
        Ok(await _equipes.ListarAsync(ct));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<EquipeDto>> Obter(Guid id, CancellationToken ct) =>
        Ok(await _equipes.ObterAsync(id, ct));

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<EquipeDto>> Criar([FromBody] CriarEquipeRequest request, CancellationToken ct)
    {
        var dto = await _equipes.CriarAsync(request, ct);
        return CreatedAtAction(nameof(Obter), new { id = dto.Id }, dto);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        await _equipes.RemoverAsync(id, ct);
        return NoContent();
    }
}
