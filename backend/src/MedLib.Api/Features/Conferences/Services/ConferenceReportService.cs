using MedLib.Api.Domain.Entities;
using MedLib.Api.Features.Conferences.Dtos;
using MedLib.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Features.Conferences.Services;

public class ConferenceReportService : IConferenceReportService
{
    private readonly MedLibDbContext _context;

    public ConferenceReportService(MedLibDbContext context)
    {
        _context = context;
    }

    public async Task AutoFinalizeExpiredConferencesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var expiredConferences = await _context.ConferenciasMedicas
            .Where(c => c.FechaHoraFin <= now && c.EstadoEvento != "Finalizada" && c.EstadoEvento != "Cancelada")
            .ToListAsync(cancellationToken);

        if (expiredConferences.Count > 0)
        {
            foreach (var c in expiredConferences)
            {
                c.EstadoEvento = "Finalizada";
                c.AsistenciaAbierta = false;
            }
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<ConferenceReportDto?> GenerateConferenceReportAsync(int conferenceId, CancellationToken cancellationToken = default)
    {
        await AutoFinalizeExpiredConferencesAsync(cancellationToken);

        var conference = await _context.ConferenciasMedicas
            .AsNoTracking()
            .Include(c => c.Inscripciones)
            .Include(c => c.Asistencias)
            .FirstOrDefaultAsync(c => c.IdConferencia == conferenceId, cancellationToken);

        if (conference == null)
        {
            return null;
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

        var confSummary = MapToSummary(conference);

        return new ConferenceReportDto(
            confSummary,
            inscripciones.Count,
            asistencias.Count,
            participantes.Count(p => p.Estado == "Acreditado"),
            participantes.Count(p => p.Estado == "Espontaneo"),
            participantes.Count(p => p.Estado == "Inasistencia"),
            participantes.OrderBy(p => p.Apellidos).ThenBy(p => p.Nombres).ToList()
        );
    }

    public ConferenceSummaryDto MapToSummary(ConferenciaMedica conference)
    {
        return new ConferenceSummaryDto(
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
            conference.Inscripciones?.Count ?? 0,
            conference.Asistencias?.Count ?? 0
        );
    }
}
