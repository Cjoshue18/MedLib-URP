using MedLib.Api.Domain.Entities;

namespace MedLib.Api.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(UsuarioAdmin user);
    (string Token, DateTime ExpiresAt) GenerateTokenWithExpiration(UsuarioAdmin user);
}
