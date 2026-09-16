using MedLib.Api.Common.Constants;
using MedLib.Api.Common.Validation;
using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Conferences.Dtos;
using MedLib.Api.Features.Conferences.Services;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Conferences.Controllers;

[ApiController]
[Route("api/v1/conferences")]
public class ConferencesController : ControllerBase
{
    private readonly MedLibDbContext _context;
    private readonly IConferenceReportService _reportService;

    public ConferencesController(MedLibDbContext context, IConferenceReportService reportService)
    {
        _context = context;
        _reportService = reportService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ConferenceSummaryDto>>> GetAll(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        CancellationToken cancellationToken)
    {
        await _reportService.AutoFinalizeExpiredConferencesAsync(cancellationToken);

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
        await _reportService.AutoFinalizeExpiredConferencesAsync(cancellationToken);

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

        var validationError = ParticipantDocumentValidator.Validate(
            request.TipoParticipante,
            request.TipoDocumento,
            request.NumeroDocumento,
            request.Nombres,
            request.Apellidos,
            request.Correo,
            request.CicloAcademico);

        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        var normalizedDoc = request.NumeroDocumento.Trim().ToUpperInvariant();
        var existingInscripcion = await _context.Inscripciones
            .FirstOrDefaultAsync(i => i.IdConferencia == id && i.NumeroDocumento == normalizedDoc, cancellationToken);

        if (existingInscripcion != null)
        {
            return Conflict(new 
            { 
                alreadyRegistered = true,
                message = $"El participante con documento {normalizedDoc} ya se encuentra pre-inscrito en esta conferencia.",
                participant = new 
                {
                    nombres = existingInscripcion.Nombres,
                    apellidos = existingInscripcion.Apellidos,
                    tipoDocumento = existingInscripcion.TipoDocumento,
                    numeroDocumento = existingInscripcion.NumeroDocumento,
                    tipoParticipante = existingInscripcion.TipoParticipante,
                    correo = existingInscripcion.Correo,
                    cicloAcademico = existingInscripcion.CicloAcademico
                }
            });
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

        var validationError = ParticipantDocumentValidator.Validate(
            request.TipoParticipante,
            request.TipoDocumento,
            request.NumeroDocumento,
            request.Nombres,
            request.Apellidos,
            request.Correo,
            request.CicloAcademico);

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

        var level = AcademicLevels.Normalize(tipoParticipante);

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
}
