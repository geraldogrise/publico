using System.Text;
using GestaoProjetos.Api.Middleware;
using GestaoProjetos.Api.Security;
using GestaoProjetos.Application;
using GestaoProjetos.Application.Abstractions;
using GestaoProjetos.Infrastructure;
using GestaoProjetos.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ---- Camadas (composition root / DI) ----
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Token JWT (adapter na camada de API).
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<IGeradorToken, GeradorTokenJwt>();

var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.Secret))
    jwt.Secret = "chave-secreta-de-desenvolvimento-gestao-projetos-2026-min-32chars";

// ---- Autenticacao JWT ----
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret))
        };
    });
builder.Services.AddAuthorization();

// ---- CORS para o front Angular ----
const string PoliticaCors = "PermitirFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(PoliticaCors, policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ---- MVC + Swagger ----
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Gestao de Projetos API",
        Version = "v1",
        Description = "API de gestao de projetos (Kanban) - Arquitetura Hexagonal + DDD."
    });

    var jwtScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe o token JWT. Ex.: Bearer {token}",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = JwtBearerDefaults.AuthenticationScheme
        }
    };
    c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, jwtScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwtScheme, Array.Empty<string>() } });
});

var app = builder.Build();

// ---- Seed / criacao do banco ----
// Pulado no ambiente de Testes (a factory configura o provider em memoria).
if (!app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var senha = scope.ServiceProvider.GetRequiredService<IServicoSenha>();
    await DbInitializer.InicializarAsync(ctx, senha);
}

app.UseMiddleware<TratamentoExcecoesMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestao de Projetos API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors(PoliticaCors);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Exposto para o projeto de testes (WebApplicationFactory<Program>).
public partial class Program { }
