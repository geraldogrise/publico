namespace GestaoProjetos.Api.Security;

/// <summary>
/// Opcoes de configuracao do JWT, carregadas de appsettings (secao "Jwt").
/// </summary>
public class JwtOptions
{
    public string Issuer { get; set; } = "GestaoProjetos";
    public string Audience { get; set; } = "GestaoProjetosClient";
    public string Secret { get; set; } = string.Empty;
    public int ExpiraEmMinutos { get; set; } = 480;
}
