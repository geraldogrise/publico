using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Domain.Enums;
using GestaoProjetos.Tests.Infraestrutura;
using Xunit;

namespace GestaoProjetos.Tests.Api;

public class ProjetosETarefasTests : IClassFixture<FabricaApiTeste>
{
    private readonly FabricaApiTeste _fabrica;

    public ProjetosETarefasTests(FabricaApiTeste fabrica) => _fabrica = fabrica;

    private async Task<HttpClient> ClientAutenticadoAsync()
    {
        var client = _fabrica.CreateClient();
        var resposta = await client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin@demo.com", "123456"));
        var login = await resposta.Content.ReadFromJsonAsync<LoginResponse>();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", login!.Token);
        return client;
    }

    [Fact]
    public async Task ListarProjetos_DeveRetornarSeed()
    {
        var client = _fabrica.CreateClient();

        var projetos = await client.GetFromJsonAsync<List<ProjetoDto>>("/api/projetos");

        Assert.NotNull(projetos);
        Assert.True(projetos!.Count >= 2);
    }

    [Fact]
    public async Task CriarProjeto_SemToken_DeveRetornar401()
    {
        var client = _fabrica.CreateClient();
        var equipes = await client.GetFromJsonAsync<List<EquipeDto>>("/api/equipes");
        var equipeId = equipes!.First().Id;

        var resposta = await client.PostAsJsonAsync("/api/projetos",
            new CriarProjetoRequest("Projeto Sem Auth", null, equipeId, null, null));

        Assert.Equal(HttpStatusCode.Unauthorized, resposta.StatusCode);
    }

    [Fact]
    public async Task CriarProjeto_ComToken_DeveCriar()
    {
        var client = await ClientAutenticadoAsync();
        var equipes = await client.GetFromJsonAsync<List<EquipeDto>>("/api/equipes");
        var equipeId = equipes!.First().Id;

        var resposta = await client.PostAsJsonAsync("/api/projetos",
            new CriarProjetoRequest("Projeto de Teste", "Criado no teste de integracao", equipeId, null, null));

        Assert.Equal(HttpStatusCode.Created, resposta.StatusCode);
        var projeto = await resposta.Content.ReadFromJsonAsync<ProjetoDto>();
        Assert.NotNull(projeto);
        Assert.Equal("Projeto de Teste", projeto!.Nome);
    }

    [Fact]
    public async Task CriarEListarTarefa_DeveFuncionar()
    {
        var client = await ClientAutenticadoAsync();
        var projetos = await client.GetFromJsonAsync<List<ProjetoDto>>("/api/projetos");
        var projetoId = projetos!.First().Id;

        var criacao = await client.PostAsJsonAsync("/api/tarefas",
            new CriarTarefaRequest(
                "Tarefa de Teste", "Descricao", projetoId, null, null,
                PrioridadeTarefa.Alta, StatusTarefa.AFazer, null));

        Assert.Equal(HttpStatusCode.Created, criacao.StatusCode);
        var tarefaCriada = await criacao.Content.ReadFromJsonAsync<TarefaDto>();
        Assert.NotNull(tarefaCriada);

        var lista = await client.GetFromJsonAsync<List<TarefaDto>>($"/api/tarefas?projetoId={projetoId}");
        Assert.NotNull(lista);
        Assert.Contains(lista!, t => t.Id == tarefaCriada!.Id);
    }

    [Fact]
    public async Task MoverTarefa_DeveAlterarStatus()
    {
        var client = await ClientAutenticadoAsync();
        var projetos = await client.GetFromJsonAsync<List<ProjetoDto>>("/api/projetos");
        var projetoId = projetos!.First().Id;

        var criacao = await client.PostAsJsonAsync("/api/tarefas",
            new CriarTarefaRequest(
                "Tarefa para mover", null, projetoId, null, null,
                PrioridadeTarefa.Media, StatusTarefa.Backlog, null));
        var tarefa = await criacao.Content.ReadFromJsonAsync<TarefaDto>();

        var mover = await client.PatchAsJsonAsync($"/api/tarefas/{tarefa!.Id}/mover",
            new MoverTarefaRequest(StatusTarefa.EmAndamento, 1));

        Assert.Equal(HttpStatusCode.OK, mover.StatusCode);
        var atualizada = await mover.Content.ReadFromJsonAsync<TarefaDto>();
        Assert.Equal(StatusTarefa.EmAndamento, atualizada!.Status);
    }
}
