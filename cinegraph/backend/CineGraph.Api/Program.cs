using System.Text;
using HotChocolate;
using HotChocolate.Authorization;
using CineGraph.Api.Auth;
using CineGraph.Api.Data;
using CineGraph.Api.GraphQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---- JWT ----
var jwtOptions = new JwtOptions();
builder.Configuration.GetSection("Jwt").Bind(jwtOptions);
builder.Services.AddSingleton(jwtOptions);
builder.Services.AddSingleton<JwtTokenService>();

// ---- EF Core (SQLite) ----
var conn = builder.Configuration.GetConnectionString("Default") ?? "Data Source=cinegraph.db";
builder.Services.AddDbContextFactory<AppDbContext>(o => o.UseSqlite(conn));

// ---- Autenticacao/Autorizacao ----
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
        };
    });
builder.Services.AddAuthorization();

// ---- CORS (frontend GraphQL) ----
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// ---- GraphQL (HotChocolate) ----
builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<MovieExtensions>()
    .AddFiltering()
    .AddSorting()
    .RegisterDbContextFactory<AppDbContext>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL(); // endpoint: /graphql (com IDE Nitro/Banana Cake Pop)
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "CineGraph" }));

// Seed do banco (pulado no ambiente de Testes, que usa InMemory).
if (!app.Environment.IsEnvironment("Testing"))
{
    var factory = app.Services.GetRequiredService<IDbContextFactory<AppDbContext>>();
    await using var db = await factory.CreateDbContextAsync();
    await DbSeeder.SeedAsync(db);
}

app.Run();

// Exposto para o projeto de testes (WebApplicationFactory<Program>).
public partial class Program { }
