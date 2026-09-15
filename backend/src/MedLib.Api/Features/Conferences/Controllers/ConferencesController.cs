using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Conferences.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Conferences.Controllers;

[ApiController]
[Route("api/v1/conferences")]
public class ConferencesController : ControllerBase
{
    private readonly MedLibDbContext _context;

    public ConferencesController(MedLibDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ConferenceSummaryDto>>> GetAll(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        CancellationToken cancellationToken)
    {
        await AutoFinalizeExpiredConferencesAsync(_context, cancellationToken);

        var query = _context.ConferenciasMedicas.AsNoTracking();

        if (desde.HasValue)
        {
            var desdeUtc = DateTime.SpecifyKind(desde.Value, DateTimeKind.Utc);
            query = query.Where(c => c.FechaHoraFin >= desdeUtc);
        }

        if (hasta.HasValue)
        {
            var hastaUtc = DateTime.SpecifyKind(hasta.Value, DateTimeKind.Utc);
            query = query.Where(c => c.FechaHoraInicio <= hastaUtc);
        }

        var conferences = await query
            .OrderBy(c => c.FechaHoraInicio)
            .Select(c => new ConferenceSummaryDto(
                c.IdConferencia,
                c.TituloEvento,
                c.ExpositorPonente,
                c.EntidadEditorial,
                c.FechaHoraInicio,
                c.FechaHoraFin,
                c.Modalidad,
                c.EnlaceVirtual,
                c.AsistenciaAbierta,
                c.EstadoEvento,
                c.AutoPurgar30Dias,
                c.FechaCaducidadPurge,
                c.Inscripciones.Count,
                c.Asistencias.Count
            ))
            .ToListAsync(cancellationToken);

        return Ok(conferences);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ConferenceSummaryDto>> GetById(int id, CancellationToken cancellationToken)
    {
        await AutoFinalizeExpiredConferencesAsync(_context, cancellationToken);

        var conference = await _context.ConferenciasMedicas
            .AsNoTracking()
            .Where(c => c.IdConferencia == id)
            .Select(c => new ConferenceSummaryDto(
                c.IdConferencia,
                c.TituloEvento,
                c.ExpositorPonente,
                c.EntidadEditorial,
                c.FechaHoraInicio,
                c.FechaHoraFin,
                c.Modalidad,
                c.EnlaceVirtual,
                c.AsistenciaAbierta,
                c.EstadoEvento,
                c.AutoPurgar30Dias,
                c.FechaCaducidadPurge,
                c.Inscripciones.Count,
                c.Asistencias.Count
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        return Ok(conference);
    }

    public static async Task AutoFinalizeExpiredConferencesAsync(MedLibDbContext context, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var expiredConferences = await context.ConferenciasMedicas
            .Where(c => c.FechaHoraFin <= now && c.EstadoEvento != "Finalizada" && c.EstadoEvento != "Cancelada")
            .ToListAsync(cancellationToken);

        if (expiredConferences.Count > 0)
        {
            foreach (var c in expiredConferences)
            {
                c.EstadoEvento = "Finalizada";
                c.AsistenciaAbierta = false;
            }
            await context.SaveChangesAsync(cancellationToken);
        }
    }

    [HttpPost("{id:int}/register")]
    public async Task<IActionResult> Register(int id, [FromBody] RegisterParticipantRequest request, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        if (conference.EstadoEvento == "Cancelada")
        {
            return BadRequest(new { message = "No es posible inscribirse a una conferencia cancelada." });
        }

        var validationError = ValidateParticipantData(request.TipoParticipante, request.TipoDocumento, request.NumeroDocumento, request.Nombres, request.Apellidos, request.Correo, request.CicloAcademico);
        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        var normalizedDoc = request.NumeroDocumento.Trim().ToUpperInvariant();
        var alreadyRegistered = await _context.Inscripciones
            .AnyAsync(i => i.IdConferencia == id && i.NumeroDocumento == normalizedDoc, cancellationToken);

        if (alreadyRegistered)
        {
            return Conflict(new { message = $"El participante con documento {normalizedDoc} ya se encuentra pre-inscrito en esta conferencia." });
        }

        var isPregrado = request.TipoParticipante.Equals("Pregrado", StringComparison.OrdinalIgnoreCase) ||
                         request.TipoParticipante.Equals("Estudiante", StringComparison.OrdinalIgnoreCase);

        var inscripcion = new Inscripcion
        {
            IdConferencia = id,
            TipoParticipante = request.TipoParticipante.Trim(),
            TipoDocumento = request.TipoDocumento.Trim().ToUpperInvariant(),
            NumeroDocumento = normalizedDoc,
            Nombres = request.Nombres.Trim(),
            Apellidos = request.Apellidos.Trim(),
            Correo = request.Correo.Trim().ToLowerInvariant(),
            CicloAcademico = isPregrado ? request.CicloAcademico : null,
            FechaHoraRegistro = DateTime.UtcNow
        };

        _context.Inscripciones.Add(inscripcion);
        await SyncParticipantToNewsletterAsync(inscripcion.Correo, inscripcion.TipoParticipante, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return StatusCode(201, new 
        { 
            message = "Pre-inscripción realizada exitosamente.",
            idInscripcion = inscripcion.IdInscripcion,
            evento = conference.TituloEvento,
            participante = $"{inscripcion.Nombres} {inscripcion.Apellidos}"
        });
    }

    [HttpPost("{id:int}/attendance")]
    public async Task<IActionResult> MarkAttendance(int id, [FromBody] MarkAttendanceRequest request, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        if (!conference.AsistenciaAbierta)
        {
            return BadRequest(new { message = "La marcación de asistencia para esta conferencia no se encuentra habilitada en este momento." });
        }

        var validationError = ValidateParticipantData(request.TipoParticipante, request.TipoDocumento, request.NumeroDocumento, request.Nombres, request.Apellidos, request.Correo, request.CicloAcademico);
        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        var normalizedDoc = request.NumeroDocumento.Trim().ToUpperInvariant();
        var alreadyMarked = await _context.Asistencias
            .AnyAsync(a => a.IdConferencia == id && a.NumeroDocumento == normalizedDoc, cancellationToken);

        if (alreadyMarked)
        {
            return Conflict(new { message = $"La asistencia para el documento {normalizedDoc} ya fue registrada previamente." });
        }

        var isPregrado = request.TipoParticipante.Equals("Pregrado", StringComparison.OrdinalIgnoreCase) ||
                         request.TipoParticipante.Equals("Estudiante", StringComparison.OrdinalIgnoreCase);

        var asistencia = new Asistencia
        {
            IdConferencia = id,
            TipoParticipante = request.TipoParticipante.Trim(),
            TipoDocumento = request.TipoDocumento.Trim().ToUpperInvariant(),
            NumeroDocumento = normalizedDoc,
            Nombres = request.Nombres.Trim(),
            Apellidos = request.Apellidos.Trim(),
            Correo = request.Correo.Trim().ToLowerInvariant(),
            CicloAcademico = isPregrado ? request.CicloAcademico : null,
            FechaHoraMarcacion = DateTime.UtcNow,
            EsAsistenciaValida = true
        };

        _context.Asistencias.Add(asistencia);
        await SyncParticipantToNewsletterAsync(asistencia.Correo, asistencia.TipoParticipante, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new 
        { 
            message = "Asistencia registrada exitosamente.",
            idAsistencia = asistencia.IdAsistencia,
            evento = conference.TituloEvento,
            participante = $"{asistencia.Nombres} {asistencia.Apellidos}",
            hora = asistencia.FechaHoraMarcacion
        });
    }

    private async Task SyncParticipantToNewsletterAsync(string email, string tipoParticipante, CancellationToken cancellationToken)
    {
        var cleanEmail = email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(cleanEmail) || !cleanEmail.Contains('@')) return;

        var existing = await _context.SuscriptoresBoletin
            .FirstOrDefaultAsync(s => s.CorreoInstitucional == cleanEmail, cancellationToken);

        var level = MedLib.Api.Features.Newsletter.Controllers.NewsletterController.MapParticipantTypeToAcademicLevel(tipoParticipante);

        if (existing == null)
        {
            _context.SuscriptoresBoletin.Add(new SuscriptorBoletin
            {
                CorreoInstitucional = cleanEmail,
                NivelAcademico = level,
                FechaSuscripcion = DateTime.UtcNow,
                EstadoActivo = true
            });
        }
        else if (!existing.EstadoActivo)
        {
            existing.EstadoActivo = true;
            existing.NivelAcademico = level;
        }
    }

    private static string? ValidateParticipantData(
        string tipoParticipante, 
        string tipoDocumento, 
        string numeroDocumento, 
        string nombres, 
        string apellidos, 
        string correo, 
        int? cicloAcademico)
    {
        if (string.IsNullOrWhiteSpace(nombres) || string.IsNullOrWhiteSpace(apellidos))
        {
            return "Los nombres y apellidos son obligatorios.";
        }

        if (string.IsNullOrWhiteSpace(correo) || !correo.Contains('@'))
        {
            return "Debe ingresar un correo electrónico válido.";
        }

        var doc = numeroDocumento?.Trim() ?? string.Empty;
        var tipoDoc = tipoDocumento?.Trim().ToUpperInvariant() ?? string.Empty;

        if (tipoDoc == "DNI")
        {
            if (doc.Length != 8 || !doc.All(char.IsDigit))
            {
                return "El DNI debe contener exactamente 8 dígitos numéricos.";
            }
        }
        else if (tipoDoc == "CODIGO_URP")
        {
            if (doc.Length != 9 || !doc.All(char.IsDigit))
            {
                return "El Código Universitario URP debe contener exactamente 9 dígitos numéricos.";
            }
        }
        else if (tipoDoc == "CE")
        {
            if (doc.Length != 9)
            {
                return "El Carné de Extranjería (CE) debe contener exactamente 9 caracteres.";
            }
        }
        else
        {
            if (doc.Length < 8 || doc.Length > 20)
            {
                return "El documento debe contener entre 8 y 20 caracteres.";
            }
        }

        var isPregrado = tipoParticipante.Equals("Pregrado", StringComparison.OrdinalIgnoreCase) ||
                         tipoParticipante.Equals("Estudiante", StringComparison.OrdinalIgnoreCase);

        if (isPregrado)
        {
            if (!cicloAcademico.HasValue || cicloAcademico.Value < 1 || cicloAcademico.Value > 14)
            {
                return "Para estudiantes de pregrado, el ciclo académico debe ser un número entre 1 y 14.";
            }
        }

        return null;
    }
}
