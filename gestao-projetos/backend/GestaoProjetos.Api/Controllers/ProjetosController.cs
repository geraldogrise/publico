using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Application.UseCases.Projetos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoProjetos.Api.Controllers;

[ApiController]
[Route("api/projetos")]
public class ProjetosController : ControllerBase
{
    private readonly IProjetoService _projetos;

    public ProjetosController(IProjetoService projetos) => _projetos = projetos;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<ProjetoDto>>> Listar(CancellationToken ct) =>
        Ok(await _projetos.ListarAsync(ct));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProjetoDto>> Obter(Guid id, CancellationToken ct) =>
        Ok(await _projetos.ObterAsync(id, ct));

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProjetoDto>> Criar([FromBody] CriarProjetoRequest request, CancellationToken ct)
    {
        var dto = await _projetos.CriarAsync(request, ct);
        return CreatedAtAction(nameof(Obter), new { id = dto.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ProjetoDto>> Atualizar(Guid id, [FromBody] AtualizarProjetoRequest request, CancellationToken ct) =>
        Ok(await _projetos.AtualizarAsync(id, request, ct));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Remover(Guid id, CancellationToken ct)
    {
        await _projetos.RemoverAsync(id, ct);
        return NoContent();
    }
}
