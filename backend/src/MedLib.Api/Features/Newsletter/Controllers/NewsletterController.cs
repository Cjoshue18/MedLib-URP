using System.Text.RegularExpressions;
using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Newsletter.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Newsletter.Controllers;

[ApiController]
[Route("api/v1/newsletter")]
public class NewsletterController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase
    );

    public NewsletterController(MedLibDbContext context)
    {
        _context = context;
    }

    [HttpPost("subscribe")]
    [AllowAnonymous]
    public async Task<IActionResult> Subscribe(
        [FromBody] SubscribeNewsletterRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.CorreoInstitucional) || !EmailRegex.IsMatch(request.CorreoInstitucional.Trim()))
        {
            return BadRequest(new { message = "Debe proporcionar un correo electrónico válido." });
        }

        var normalizedEmail = request.CorreoInstitucional.Trim().ToLowerInvariant();
        var rawLevel = request.NivelAcademico?.Trim().ToLowerInvariant() ?? string.Empty;

        string normalizedLevel = rawLevel switch
        {
            "pregrado" => "Pregrado",
            "posgrado" => "Posgrado",
            "postgrado" => "Posgrado",
            "residentado" => "Residentado",
            _ => string.Empty
        };

        if (string.IsNullOrEmpty(normalizedLevel))
        {
            return BadRequest(new { message = "El nivel académico debe ser 'Pregrado', 'Posgrado' o 'Residentado'." });
        }

        var existing = await _context.SuscriptoresBoletin
            .FirstOrDefaultAsync(s => s.CorreoInstitucional == normalizedEmail, cancellationToken);

        if (existing != null)
        {
            existing.NivelAcademico = normalizedLevel;
            existing.EstadoActivo = true;
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new SubscribeNewsletterResponse(
                $"Suscripción actualizada exitosamente como {normalizedLevel}.",
                existing.IdSuscriptor,
                false
            ));
        }

        var subscriber = new SuscriptorBoletin
        {
            CorreoInstitucional = normalizedEmail,
            NivelAcademico = normalizedLevel,
            FechaSuscripcion = DateTime.UtcNow,
            EstadoActivo = true
        };

        _context.SuscriptoresBoletin.Add(subscriber);
        await _context.SaveChangesAsync(cancellationToken);

        return StatusCode(StatusCodes.Status201Created, new SubscribeNewsletterResponse(
            $"¡Te has registrado exitosamente al boletín informativo como {normalizedLevel}!",
            subscriber.IdSuscriptor,
            true
        ));
    }

    [HttpGet("stats")]
    [AllowAnonymous]
    public async Task<ActionResult<NewsletterStatsDto>> GetStats(CancellationToken cancellationToken)
    {
        var subscribers = await _context.SuscriptoresBoletin
            .Where(s => s.EstadoActivo)
            .GroupBy(s => s.NivelAcademico)
            .Select(g => new { Nivel = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var pregrado = subscribers.FirstOrDefault(s => s.Nivel == "Pregrado")?.Count ?? 0;
        var posgrado = subscribers.FirstOrDefault(s => s.Nivel == "Posgrado")?.Count ?? 0;
        var residentado = subscribers.FirstOrDefault(s => s.Nivel == "Residentado")?.Count ?? 0;
        var total = pregrado + posgrado + residentado;

        return Ok(new NewsletterStatsDto(total, pregrado, posgrado, residentado));
    }

    [HttpGet("admin/subscribers")]
    [HttpGet("/api/v1/admin/newsletter/subscribers")]
    [Authorize]
    public async Task<ActionResult<List<SubscriberDto>>> GetSubscribers(
        [FromQuery] string? q,
        [FromQuery] string? nivel,
        CancellationToken cancellationToken)
    {
        var query = _context.SuscriptoresBoletin.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var search = q.Trim().ToLowerInvariant();
            query = query.Where(s => s.CorreoInstitucional.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(nivel))
        {
            var cleanNivel = nivel.Trim();
            query = query.Where(s => s.NivelAcademico == cleanNivel);
        }

        var results = await query
            .OrderByDescending(s => s.FechaSuscripcion)
            .Select(s => new SubscriberDto(
                s.IdSuscriptor,
                s.CorreoInstitucional,
                s.NivelAcademico,
                s.FechaSuscripcion,
                s.EstadoActivo
            ))
            .ToListAsync(cancellationToken);

        return Ok(results);
    }

    [HttpDelete("admin/subscribers/{id:int}")]
    [HttpDelete("/api/v1/admin/newsletter/subscribers/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteSubscriber(int id, CancellationToken cancellationToken)
    {
        var subscriber = await _context.SuscriptoresBoletin.FindAsync([id], cancellationToken);
        if (subscriber == null)
        {
            return NotFound(new { message = "Suscriptor no encontrado." });
        }

        _context.SuscriptoresBoletin.Remove(subscriber);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Suscriptor eliminado correctamente." });
    }
}
