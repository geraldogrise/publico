using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;

namespace CineGraph.Tests;

public class GraphQLTests : IClassFixture<CineGraphFactory>
{
    private readonly CineGraphFactory _factory;

    public GraphQLTests(CineGraphFactory factory) => _factory = factory;

    private static async Task<JsonElement> PostAsync(HttpClient client, string query, object? variables = null)
    {
        var payload = JsonSerializer.Serialize(new { query, variables });
        var resp = await client.PostAsync(
            "/graphql",
            new StringContent(payload, Encoding.UTF8, "application/json"));
        var json = await resp.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }

    [Fact]
    public async Task Health_DeveRetornarOk()
    {
        var client = _factory.CreateClient();
        var resp = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);
        Assert.Contains("CineGraph", await resp.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Movies_DeveRetornarSeedComGeneros()
    {
        var client = _factory.CreateClient();
        var result = await PostAsync(client, "{ movies { title releaseYear genres { name } } }");

        var movies = result.GetProperty("data").GetProperty("movies");
        Assert.True(movies.GetArrayLength() >= 3);
        var titles = movies.EnumerateArray().Select(m => m.GetProperty("title").GetString()).ToList();
        Assert.Contains("Matrix", titles);
    }

    [Fact]
    public async Task MovieById_DeveTrazerElencoEAverageRating()
    {
        var client = _factory.CreateClient();
        // Descobre um id existente.
        var list = await PostAsync(client, "{ movies { id title } }");
        var first = list.GetProperty("data").GetProperty("movies").EnumerateArray().First();
        var id = first.GetProperty("id").GetInt32();

        var result = await PostAsync(
            client,
            $"{{ movieById(id: {id}) {{ title averageRating reviewCount cast {{ character person {{ name }} }} }} }}");

        var movie = result.GetProperty("data").GetProperty("movieById");
        Assert.False(string.IsNullOrEmpty(movie.GetProperty("title").GetString()));
        Assert.True(movie.GetProperty("averageRating").GetDouble() >= 0);
    }

    [Fact]
    public async Task SearchMovies_DeveFiltrarPorTermo()
    {
        var client = _factory.CreateClient();
        var result = await PostAsync(client, "{ searchMovies(term: \"matrix\") { title } }");
        var movies = result.GetProperty("data").GetProperty("searchMovies");
        Assert.Equal(1, movies.GetArrayLength());
        Assert.Equal("Matrix", movies[0].GetProperty("title").GetString());
    }

    [Fact]
    public async Task Login_ComCredenciaisValidas_DeveRetornarToken()
    {
        var client = _factory.CreateClient();
        var result = await PostAsync(
            client,
            "mutation { login(input: { email: \"admin@demo.com\", password: \"123456\" }) { token name } }");

        var login = result.GetProperty("data").GetProperty("login");
        Assert.False(string.IsNullOrEmpty(login.GetProperty("token").GetString()));
        Assert.Equal("Administrador Demo", login.GetProperty("name").GetString());
    }

    [Fact]
    public async Task Login_ComSenhaInvalida_DeveRetornarErro()
    {
        var client = _factory.CreateClient();
        var result = await PostAsync(
            client,
            "mutation { login(input: { email: \"admin@demo.com\", password: \"errada\" }) { token } }");

        Assert.True(result.TryGetProperty("errors", out var errors));
        Assert.True(errors.GetArrayLength() > 0);
    }

    [Fact]
    public async Task AddReview_Publico_DeveAdicionar()
    {
        var client = _factory.CreateClient();
        var list = await PostAsync(client, "{ movies { id } }");
        var id = list.GetProperty("data").GetProperty("movies").EnumerateArray().First().GetProperty("id").GetInt32();

        var result = await PostAsync(
            client,
            $"mutation {{ addReview(input: {{ movieId: {id}, author: \"Tester\", rating: 5, comment: \"Otimo\" }}) {{ id author rating }} }}");

        var review = result.GetProperty("data").GetProperty("addReview");
        Assert.Equal("Tester", review.GetProperty("author").GetString());
        Assert.Equal(5, review.GetProperty("rating").GetInt32());
    }

    [Fact]
    public async Task AddMovie_SemToken_DeveSerNegado()
    {
        var client = _factory.CreateClient();
        var result = await PostAsync(
            client,
            "mutation { addMovie(input: { title: \"Novo\", synopsis: \"x\", releaseYear: 2024, durationMinutes: 100 }) { id } }");

        Assert.True(result.TryGetProperty("errors", out var errors));
        Assert.True(errors.GetArrayLength() > 0);
    }

    [Fact]
    public async Task AddMovie_ComToken_DeveCriar()
    {
        var client = _factory.CreateClient();

        var loginResult = await PostAsync(
            client,
            "mutation { login(input: { email: \"admin@demo.com\", password: \"123456\" }) { token } }");
        var token = loginResult.GetProperty("data").GetProperty("login").GetProperty("token").GetString();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var result = await PostAsync(
            client,
            "mutation { addMovie(input: { title: \"Filme de Teste\", synopsis: \"sinopse\", releaseYear: 2024, durationMinutes: 120 }) { id title } }");

        var movie = result.GetProperty("data").GetProperty("addMovie");
        Assert.Equal("Filme de Teste", movie.GetProperty("title").GetString());
        Assert.True(movie.GetProperty("id").GetInt32() > 0);
    }
}
