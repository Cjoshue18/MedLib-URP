using MedLib.Api.Domain.Entities;

namespace MedLib.Api.Common.Interfaces;

public interface IRefreshTokenService
{
    string GenerateRefreshToken();
    string HashToken(string token);
    Task<RefreshToken> CreateRefreshTokenAsync(int userId, string rawToken, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<(UsuarioAdmin User, string NewRawToken, DateTime ExpiresAt, DateTime RefreshExpiresAt)?> RotateRefreshTokenAsync(string rawToken, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<bool> RevokeRefreshTokenAsync(string rawToken, string? ipAddress, string reason, CancellationToken ct = default);
    Task RevokeFamilyAsync(Guid familyId, string reason, CancellationToken ct = default);
    Task PruneStaleTokensAsync(int userId, CancellationToken ct = default);
}
