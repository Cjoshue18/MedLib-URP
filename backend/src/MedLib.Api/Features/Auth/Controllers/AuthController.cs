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

    public AuthController(
        MedLibDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
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

        var token = _tokenService.GenerateToken(user);
        var response = new LoginResponse(
            token,
            user.Username,
            user.Nombres,
            user.Rol,
            DateTime.UtcNow.AddHours(8)
        );

        return Ok(response);
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
