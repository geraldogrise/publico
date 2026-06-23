using System.Net;
using System.Net.Http.Json;
using GestaoProjetos.Application.DTOs;
using GestaoProjetos.Tests.Infraestrutura;
using Xunit;

namespace GestaoProjetos.Tests.Api;

public class HealthEAuthTests : IClassFixture<FabricaApiTeste>
{
    private readonly FabricaApiTeste _fabrica;

    public HealthEAuthTests(FabricaApiTeste fabrica) => _fabrica = fabrica;

    [Fact]
    public async Task Health_DeveRetornarOk()
    {
        var client = _fabrica.CreateClient();

        var resposta = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        var corpo = await resposta.Content.ReadAsStringAsync();
        Assert.Contains("ok", corpo);
    }

    [Fact]
    public async Task Login_ComCredenciaisValidas_DeveRetornarToken()
    {
        var client = _fabrica.CreateClient();

        var resposta = await client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin@demo.com", "123456"));

        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        var login = await resposta.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(login);
        Assert.False(string.IsNullOrWhiteSpace(login!.Token));
        Assert.Equal("admin@demo.com", login.Usuario.Email);
    }

    [Fact]
    public async Task Login_ComSenhaInvalida_DeveRetornar401()
    {
        var client = _fabrica.CreateClient();

        var resposta = await client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin@demo.com", "senha-errada"));

        Assert.Equal(HttpStatusCode.Unauthorized, resposta.StatusCode);
    }
}
