using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MedLib.Api.Common.Interfaces;
using MedLib.Api.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace MedLib.Api.Common.Security;

public class JwtTokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(UsuarioAdmin user)
    {
        var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
            ?? _configuration["Jwt:SecretKey"] 
            ?? throw new InvalidOperationException("Jwt:SecretKey configuration is missing.");

        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
            ?? _configuration["Jwt:Issuer"] 
            ?? "MedLibUrp";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
            ?? _configuration["Jwt:Audience"] 
            ?? "MedLibUrpApp";
        var expStr = Environment.GetEnvironmentVariable("JWT_EXPIRATION_HOURS") 
            ?? _configuration["Jwt:ExpirationHours"];
        var expirationHours = double.TryParse(expStr, out var hours) ? hours : 8.0;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.IdUsuarioAdmin.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(ClaimTypes.Name, user.Nombres),
            new Claim(ClaimTypes.Role, user.Rol),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
