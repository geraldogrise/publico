using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CineGraph.Api.Domain;
using Microsoft.IdentityModel.Tokens;

namespace CineGraph.Api.Auth;

public class JwtOptions
{
    public string Secret { get; set; } = "cinegraph-dev-secret-key-please-change-min-32-chars";
    public string Issuer { get; set; } = "CineGraph";
    public string Audience { get; set; } = "CineGraphClients";
    public int ExpiresMinutes { get; set; } = 480;
}

/// <summary>Gera tokens JWT para usuarios autenticados.</summary>
public class JwtTokenService
{
    private readonly JwtOptions _options;

    public JwtTokenService(JwtOptions options) => _options = options;

    public string Generate(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpiresMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
