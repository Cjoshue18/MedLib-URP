using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Conferences.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Conferences.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/admin/conferences")]
public class AdminConferencesController : ControllerBase
{
    private readonly MedLibDbContext _context;

    public AdminConferencesController(MedLibDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ConferenceSummaryDto>>> GetAll(CancellationToken cancellationToken)
    {
        await ConferencesController.AutoFinalizeExpiredConferencesAsync(_context, cancellationToken);

        var list = await _context.ConferenciasMedicas
            .AsNoTracking()
            .OrderByDescending(c => c.FechaHoraInicio)
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

        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<ConferenceSummaryDto>> Create([FromBody] CreateConferenceRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.TituloEvento) || string.IsNullOrWhiteSpace(request.ExpositorPonente))
        {
            return BadRequest(new { message = "El título del evento y el ponente son obligatorios." });
        }

        var conference = new ConferenciaMedica
        {
            TituloEvento = request.TituloEvento.Trim(),
            ExpositorPonente = request.ExpositorPonente.Trim(),
            EntidadEditorial = string.IsNullOrWhiteSpace(request.EntidadEditorial) ? "FAMURP ALFIN" : request.EntidadEditorial.Trim(),
            FechaHoraInicio = request.FechaHoraInicio,
            FechaHoraFin = request.FechaHoraFin,
            Modalidad = string.IsNullOrWhiteSpace(request.Modalidad) ? "Virtual" : request.Modalidad.Trim(),
            EnlaceVirtual = string.IsNullOrWhiteSpace(request.EnlaceVirtual) ? null : request.EnlaceVirtual.Trim(),
            AsistenciaAbierta = false,
            EstadoEvento = "Programada",
            AutoPurgar30Dias = request.AutoPurgar30Dias,
            FechaCaducidadPurge = request.AutoPurgar30Dias ? request.FechaHoraFin.AddDays(30) : null,
            FechaCreacion = DateTime.UtcNow
        };

        _context.ConferenciasMedicas.Add(conference);
        await _context.SaveChangesAsync(cancellationToken);

        var result = new ConferenceSummaryDto(
            conference.IdConferencia,
            conference.TituloEvento,
            conference.ExpositorPonente,
            conference.EntidadEditorial,
            conference.FechaHoraInicio,
            conference.FechaHoraFin,
            conference.Modalidad,
            conference.EnlaceVirtual,
            conference.AsistenciaAbierta,
            conference.EstadoEvento,
            conference.AutoPurgar30Dias,
            conference.FechaCaducidadPurge,
            0,
            0
        );

        return CreatedAtAction(nameof(GetAll), new { id = conference.IdConferencia }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ConferenceSummaryDto>> Update(int id, [FromBody] UpdateConferenceRequest request, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .Include(c => c.Inscripciones)
            .Include(c => c.Asistencias)
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        conference.TituloEvento = request.TituloEvento.Trim();
        conference.ExpositorPonente = request.ExpositorPonente.Trim();
        conference.EntidadEditorial = request.EntidadEditorial.Trim();
        conference.FechaHoraInicio = request.FechaHoraInicio;
        conference.FechaHoraFin = request.FechaHoraFin;
        conference.Modalidad = request.Modalidad.Trim();
        conference.EnlaceVirtual = string.IsNullOrWhiteSpace(request.EnlaceVirtual) ? null : request.EnlaceVirtual.Trim();
        conference.EstadoEvento = request.EstadoEvento.Trim();
        conference.AutoPurgar30Dias = request.AutoPurgar30Dias;
        conference.FechaCaducidadPurge = request.AutoPurgar30Dias ? request.FechaHoraFin.AddDays(30) : null;

        await _context.SaveChangesAsync(cancellationToken);

        var result = new ConferenceSummaryDto(
            conference.IdConferencia,
            conference.TituloEvento,
            conference.ExpositorPonente,
            conference.EntidadEditorial,
            conference.FechaHoraInicio,
            conference.FechaHoraFin,
            conference.Modalidad,
            conference.EnlaceVirtual,
            conference.AsistenciaAbierta,
            conference.EstadoEvento,
            conference.AutoPurgar30Dias,
            conference.FechaCaducidadPurge,
            conference.Inscripciones.Count,
            conference.Asistencias.Count
        );

        return Ok(result);
    }

    [HttpPatch("{id:int}/toggle-attendance")]
    public async Task<IActionResult> ToggleAttendance(int id, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        conference.AsistenciaAbierta = !conference.AsistenciaAbierta;
        if (conference.AsistenciaAbierta && conference.EstadoEvento == "Programada")
        {
            conference.EstadoEvento = "En Curso";
        }
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new 
        { 
            idConferencia = conference.IdConferencia,
            asistenciaAbierta = conference.AsistenciaAbierta,
            estadoEvento = conference.EstadoEvento,
            message = conference.AsistenciaAbierta 
                ? "La asistencia ha sido habilitada exitosamente." 
                : "La asistencia ha sido cerrada." 
        });
    }

    [HttpPatch("{id:int}/toggle-purge")]
    public async Task<IActionResult> TogglePurge(int id, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        conference.AutoPurgar30Dias = !conference.AutoPurgar30Dias;
        conference.FechaCaducidadPurge = conference.AutoPurgar30Dias ? conference.FechaHoraFin.AddDays(30) : null;
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new 
        { 
            idConferencia = conference.IdConferencia,
            autoPurgar30Dias = conference.AutoPurgar30Dias,
            fechaCaducidadPurge = conference.FechaCaducidadPurge,
            message = conference.AutoPurgar30Dias 
                ? "Purga automática a 30 días activada." 
                : "Conservación indefinida de datos activada." 
        });
    }

    [HttpGet("{id:int}/report")]
    public async Task<ActionResult<ConferenceReportDto>> GetReport(int id, CancellationToken cancellationToken)
    {
        await ConferencesController.AutoFinalizeExpiredConferencesAsync(_context, cancellationToken);

        var conference = await _context.ConferenciasMedicas
            .AsNoTracking()
            .Include(c => c.Inscripciones)
            .Include(c => c.Asistencias)
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        var inscripciones = conference.Inscripciones.ToList();
        var asistencias = conference.Asistencias.ToList();

        var asistenciasMap = asistencias
            .GroupBy(a => a.NumeroDocumento.Trim().ToUpperInvariant())
            .ToDictionary(g => g.Key, g => g.First());

        var inscripcionesMap = inscripciones
            .GroupBy(i => i.NumeroDocumento.Trim().ToUpperInvariant())
            .ToDictionary(g => g.Key, g => g.First());

        var participantes = new List<ParticipantRecordDto>();

        foreach (var insc in inscripciones)
        {
            var docKey = insc.NumeroDocumento.Trim().ToUpperInvariant();
            if (asistenciasMap.TryGetValue(docKey, out var asist))
            {
                participantes.Add(new ParticipantRecordDto(
                    insc.NumeroDocumento,
                    insc.TipoDocumento,
                    insc.TipoParticipante,
                    insc.Nombres,
                    insc.Apellidos,
                    insc.Correo,
                    insc.CicloAcademico,
                    insc.FechaHoraRegistro,
                    asist.FechaHoraMarcacion,
                    "Acreditado"
                ));
            }
            else
            {
                participantes.Add(new ParticipantRecordDto(
                    insc.NumeroDocumento,
                    insc.TipoDocumento,
                    insc.TipoParticipante,
                    insc.Nombres,
                    insc.Apellidos,
                    insc.Correo,
                    insc.CicloAcademico,
                    insc.FechaHoraRegistro,
                    null,
                    "Inasistencia"
                ));
            }
        }

        foreach (var asist in asistencias)
        {
            var docKey = asist.NumeroDocumento.Trim().ToUpperInvariant();
            if (!inscripcionesMap.ContainsKey(docKey))
            {
                participantes.Add(new ParticipantRecordDto(
                    asist.NumeroDocumento,
                    asist.TipoDocumento,
                    asist.TipoParticipante,
                    asist.Nombres,
                    asist.Apellidos,
                    asist.Correo,
                    asist.CicloAcademico,
                    null,
                    asist.FechaHoraMarcacion,
                    "Espontaneo"
                ));
            }
        }

        var confSummary = new ConferenceSummaryDto(
            conference.IdConferencia,
            conference.TituloEvento,
            conference.ExpositorPonente,
            conference.EntidadEditorial,
            conference.FechaHoraInicio,
            conference.FechaHoraFin,
            conference.Modalidad,
            conference.EnlaceVirtual,
            conference.AsistenciaAbierta,
            conference.EstadoEvento,
            conference.AutoPurgar30Dias,
            conference.FechaCaducidadPurge,
            inscripciones.Count,
            asistencias.Count
        );

        var report = new ConferenceReportDto(
            confSummary,
            inscripciones.Count,
            asistencias.Count,
            participantes.Count(p => p.Estado == "Acreditado"),
            participantes.Count(p => p.Estado == "Espontaneo"),
            participantes.Count(p => p.Estado == "Inasistencia"),
            participantes.OrderBy(p => p.Apellidos).ThenBy(p => p.Nombres).ToList()
        );

        return Ok(report);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var conference = await _context.ConferenciasMedicas
            .FirstOrDefaultAsync(c => c.IdConferencia == id, cancellationToken);

        if (conference == null)
        {
            return NotFound(new { message = "Conferencia médica no encontrada." });
        }

        _context.ConferenciasMedicas.Remove(conference);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
