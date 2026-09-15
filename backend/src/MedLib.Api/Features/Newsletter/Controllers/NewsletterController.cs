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
            "docente" => "Docente",
            "profesor" => "Docente",
            "otro" => "Otro",
            _ => string.Empty
        };

        if (string.IsNullOrEmpty(normalizedLevel))
        {
            return BadRequest(new { message = "El nivel académico debe ser 'Pregrado', 'Posgrado', 'Residentado', 'Docente' u 'Otro'." });
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
        var docente = subscribers.FirstOrDefault(s => s.Nivel == "Docente")?.Count ?? 0;
        var otro = subscribers.FirstOrDefault(s => s.Nivel == "Otro")?.Count ?? 0;
        var total = pregrado + posgrado + residentado + docente + otro;

        return Ok(new NewsletterStatsDto(total, pregrado, posgrado, residentado, docente, otro));
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

    [HttpPost("admin/sync-conferences")]
    [HttpPost("/api/v1/admin/newsletter/sync-conferences")]
    [Authorize]
    public async Task<IActionResult> SyncFromConferences(CancellationToken cancellationToken)
    {
        var existingSubs = await _context.SuscriptoresBoletin
            .ToDictionaryAsync(s => s.CorreoInstitucional.ToLower(), s => s, cancellationToken);

        var inscripciones = await _context.Inscripciones
            .AsNoTracking()
            .Select(i => new { i.Correo, i.TipoParticipante, i.FechaHoraRegistro })
            .ToListAsync(cancellationToken);

        var asistencias = await _context.Asistencias
            .AsNoTracking()
            .Select(a => new { a.Correo, a.TipoParticipante, a.FechaHoraMarcacion })
            .ToListAsync(cancellationToken);

        var candidates = inscripciones
            .Select(i => new { Correo = i.Correo.Trim().ToLowerInvariant(), i.TipoParticipante, Fecha = i.FechaHoraRegistro })
            .Concat(asistencias.Select(a => new { Correo = a.Correo.Trim().ToLowerInvariant(), a.TipoParticipante, Fecha = a.FechaHoraMarcacion }))
            .Where(c => !string.IsNullOrWhiteSpace(c.Correo) && EmailRegex.IsMatch(c.Correo))
            .GroupBy(c => c.Correo)
            .Select(g => g.OrderByDescending(x => x.Fecha).First())
            .ToList();

        var nuevos = 0;
        foreach (var item in candidates)
        {
            var level = MapParticipantTypeToAcademicLevel(item.TipoParticipante);

            if (existingSubs.TryGetValue(item.Correo, out var existing))
            {
                if (!existing.EstadoActivo)
                {
                    existing.EstadoActivo = true;
                    existing.NivelAcademico = level;
                }
            }
            else
            {
                var newSub = new SuscriptorBoletin
                {
                    CorreoInstitucional = item.Correo,
                    NivelAcademico = level,
                    FechaSuscripcion = item.Fecha,
                    EstadoActivo = true
                };
                _context.SuscriptoresBoletin.Add(newSub);
                existingSubs[item.Correo] = newSub;
                nuevos++;
            }
        }

        if (nuevos > 0 || _context.ChangeTracker.HasChanges())
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return Ok(new
        {
            message = $"Sincronización completada. Se incorporaron {nuevos} nuevos suscriptores desde conferencias.",
            nuevosSuscriptores = nuevos,
            totalAnalizados = candidates.Count
        });
    }

    public static string MapParticipantTypeToAcademicLevel(string? participantType)
    {
        var raw = participantType?.Trim().ToLowerInvariant() ?? string.Empty;
        return raw switch
        {
            "pregrado" or "estudiante" => "Pregrado",
            "posgrado" or "postgrado" => "Posgrado",
            "residentado" => "Residentado",
            "docente" or "profesor" => "Docente",
            _ => "Otro"
        };
    }
}
