using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MedLib.Api.Common.Interfaces;
using MedLib.Api.Features.Auth.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Auth.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenService _refreshTokenService;

    public AuthController(
        MedLibDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenService refreshTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _refreshTokenService = refreshTokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Usuario y contraseña requeridos." });
        }

        var cleanUsername = request.Username.Trim().ToLowerInvariant();
        var user = await _context.UsuariosAdmin
            .FirstOrDefaultAsync(u => u.Username.ToLower() == cleanUsername, cancellationToken);

        if (user == null || !user.EstadoActivo)
        {
            return Unauthorized(new { message = "Credenciales incorrectas o usuario inactivo." });
        }

        var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Credenciales incorrectas o usuario inactivo." });
        }

        var (token, expiresAt) = _tokenService.GenerateTokenWithExpiration(user);
        var rawRefreshToken = _refreshTokenService.GenerateRefreshToken();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();
        if (userAgent.Length > 255) userAgent = userAgent[..255];

        var refreshTokenEntity = await _refreshTokenService.CreateRefreshTokenAsync(
            user.IdUsuarioAdmin,
            rawRefreshToken,
            ipAddress,
            userAgent,
            cancellationToken
        );

        var response = new LoginResponse(
            token,
            rawRefreshToken,
            user.Username,
            user.Nombres,
            user.Rol,
            expiresAt,
            refreshTokenEntity.FechaExpiracion
        );

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenRefreshResponse>> Refresh(
        [FromBody] RefreshTokenRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest(new { message = "Refresh token requerido." });
        }

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();
        if (userAgent.Length > 255) userAgent = userAgent[..255];

        var result = await _refreshTokenService.RotateRefreshTokenAsync(
            request.RefreshToken.Trim(),
            ipAddress,
            userAgent,
            cancellationToken
        );

        if (result == null)
        {
            return Unauthorized(new { message = "Sesión inválida o expirada. Por favor inicie sesión nuevamente." });
        }

        var (user, newRawToken, jwtExpiresAt, refreshExpiresAt) = result.Value;
        return Ok(new TokenRefreshResponse(
            _tokenService.GenerateToken(user),
            newRawToken,
            jwtExpiresAt,
            refreshExpiresAt
        ));
    }

    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke(
        [FromBody] RevokeTokenRequest request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _refreshTokenService.RevokeRefreshTokenAsync(
                request.RefreshToken.Trim(),
                ipAddress,
                "User requested logout",
                cancellationToken
            );
        }

        return Ok(new { message = "Sesión cerrada correctamente." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AdminUserProfileDto>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value 
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token inválido." });
        }

        var user = await _context.UsuariosAdmin
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.IdUsuarioAdmin == userId, cancellationToken);

        if (user == null || !user.EstadoActivo)
        {
            return NotFound(new { message = "Usuario no encontrado o inactivo." });
        }

        return Ok(new AdminUserProfileDto(
            user.IdUsuarioAdmin,
            user.Username,
            user.Nombres,
            user.Rol,
            user.EstadoActivo,
            user.FechaCreacion
        ));
    }
}
