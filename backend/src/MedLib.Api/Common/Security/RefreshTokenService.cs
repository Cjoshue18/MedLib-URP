using System.Security.Cryptography;
using System.Text;
using MedLib.Api.Common.Interfaces;
using MedLib.Api.Domain.Entities;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Common.Security;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly MedLibDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    public RefreshTokenService(
        MedLibDbContext context,
        IConfiguration configuration,
        ITokenService tokenService)
    {
        _context = context;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
    }

    public string HashToken(string token)
    {
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    public async Task<RefreshToken> CreateRefreshTokenAsync(
        int userId,
        string rawToken,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct = default)
    {
        await PruneStaleTokensAsync(userId, ct);

        var daysStr = Environment.GetEnvironmentVariable("JWT_REFRESH_EXPIRATION_DAYS")
            ?? _configuration["Jwt:RefreshTokenExpirationDays"];
        var expirationDays = double.TryParse(daysStr, out var days) ? days : 7.0;

        var tokenHash = HashToken(rawToken);
        var entity = new RefreshToken
        {
            IdUsuarioAdmin = userId,
            FamilyId = Guid.NewGuid(),
            TokenHash = tokenHash,
            FechaExpiracion = DateTime.UtcNow.AddDays(expirationDays),
            FechaCreacion = DateTime.UtcNow,
            CreadoPorIp = ipAddress,
            UserAgent = userAgent,
            Revocado = false
        };

        _context.RefreshTokens.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<(UsuarioAdmin User, string NewRawToken, DateTime ExpiresAt, DateTime RefreshExpiresAt)?> RotateRefreshTokenAsync(
        string rawToken,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct = default)
    {
        var hash = HashToken(rawToken);
        var token = await _context.RefreshTokens
            .Include(r => r.UsuarioAdmin)
            .FirstOrDefaultAsync(r => r.TokenHash == hash, ct);

        if (token == null || token.UsuarioAdmin == null || !token.UsuarioAdmin.EstadoActivo)
        {
            return null;
        }

        var graceStr = Environment.GetEnvironmentVariable("JWT_REFRESH_GRACE_PERIOD_SECONDS")
            ?? _configuration["Jwt:RefreshTokenGracePeriodSeconds"];
        var graceSeconds = double.TryParse(graceStr, out var sec) ? sec : 30.0;

        if (token.Revocado)
        {
            var isWithinGrace = token.FechaRevocacion.HasValue
                && DateTime.UtcNow <= token.FechaRevocacion.Value.AddSeconds(graceSeconds);

            if (!isWithinGrace)
            {
                await RevokeFamilyAsync(token.FamilyId, "Replay attack detected - token reuse attempt", ct);
                return null;
            }
        }

        if (DateTime.UtcNow >= token.FechaExpiracion)
        {
            token.Revocado = true;
            token.FechaRevocacion = DateTime.UtcNow;
            token.MotivoRevocacion = "Expired";
            await _context.SaveChangesAsync(ct);
            return null;
        }

        var newRawToken = GenerateRefreshToken();
        var newHash = HashToken(newRawToken);

        var daysStr = Environment.GetEnvironmentVariable("JWT_REFRESH_EXPIRATION_DAYS")
            ?? _configuration["Jwt:RefreshTokenExpirationDays"];
        var expirationDays = double.TryParse(daysStr, out var days) ? days : 7.0;
        var refreshExpiresAt = DateTime.UtcNow.AddDays(expirationDays);

        token.Revocado = true;
        token.FechaRevocacion = DateTime.UtcNow;
        token.ReemplazadoPorTokenHash = newHash;
        token.MotivoRevocacion = "Rotated";

        var newRefreshToken = new RefreshToken
        {
            IdUsuarioAdmin = token.IdUsuarioAdmin,
            FamilyId = token.FamilyId,
            TokenHash = newHash,
            FechaExpiracion = refreshExpiresAt,
            FechaCreacion = DateTime.UtcNow,
            CreadoPorIp = ipAddress,
            UserAgent = userAgent,
            Revocado = false
        };

        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync(ct);

        var (_, jwtExpiresAt) = _tokenService.GenerateTokenWithExpiration(token.UsuarioAdmin);
        await PruneStaleTokensAsync(token.IdUsuarioAdmin, ct);

        return (token.UsuarioAdmin, newRawToken, jwtExpiresAt, refreshExpiresAt);
    }

    public async Task<bool> RevokeRefreshTokenAsync(
        string rawToken,
        string? ipAddress,
        string reason,
        CancellationToken ct = default)
    {
        var hash = HashToken(rawToken);
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == hash, ct);
        if (token == null || token.Revocado)
        {
            return false;
        }

        token.Revocado = true;
        token.FechaRevocacion = DateTime.UtcNow;
        token.MotivoRevocacion = reason;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task RevokeFamilyAsync(Guid familyId, string reason, CancellationToken ct = default)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(r => r.FamilyId == familyId && !r.Revocado)
            .ToListAsync(ct);

        foreach (var token in activeTokens)
        {
            token.Revocado = true;
            token.FechaRevocacion = DateTime.UtcNow;
            token.MotivoRevocacion = reason;
        }

        if (activeTokens.Count > 0)
        {
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task PruneStaleTokensAsync(int userId, CancellationToken ct = default)
    {
        var staleDate = DateTime.UtcNow.AddDays(-2);
        var staleTokens = await _context.RefreshTokens
            .Where(r => r.IdUsuarioAdmin == userId &&
                       (r.FechaExpiracion < DateTime.UtcNow ||
                       (r.Revocado && r.FechaRevocacion.HasValue && r.FechaRevocacion.Value < staleDate)))
            .ToListAsync(ct);

        if (staleTokens.Count > 0)
        {
            _context.RefreshTokens.RemoveRange(staleTokens);
            await _context.SaveChangesAsync(ct);
        }
    }
}
