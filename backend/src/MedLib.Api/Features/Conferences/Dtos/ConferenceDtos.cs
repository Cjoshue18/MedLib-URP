namespace MedLib.Api.Features.Conferences.Dtos;

public record ConferenceSummaryDto(
    int IdConferencia,
    string TituloEvento,
    string ExpositorPonente,
    string EntidadEditorial,
    DateTime FechaHoraInicio,
    DateTime FechaHoraFin,
    string Modalidad,
    string? EnlaceVirtual,
    bool AsistenciaAbierta,
    string EstadoEvento,
    bool AutoPurgar30Dias,
    DateTime? FechaCaducidadPurge,
    int TotalInscritos,
    int TotalAsistentes
);

public record CreateConferenceRequest(
    string TituloEvento,
    string ExpositorPonente,
    string EntidadEditorial,
    DateTime FechaHoraInicio,
    DateTime FechaHoraFin,
    string Modalidad,
    string? EnlaceVirtual,
    bool AutoPurgar30Dias = true
);

public record UpdateConferenceRequest(
    string TituloEvento,
    string ExpositorPonente,
    string EntidadEditorial,
    DateTime FechaHoraInicio,
    DateTime FechaHoraFin,
    string Modalidad,
    string? EnlaceVirtual,
    string EstadoEvento,
    bool AutoPurgar30Dias
);

public record RegisterParticipantRequest(
    string TipoParticipante,
    string TipoDocumento,
    string NumeroDocumento,
    string Nombres,
    string Apellidos,
    string Correo,
    int? CicloAcademico
);

public record MarkAttendanceRequest(
    string TipoParticipante,
    string TipoDocumento,
    string NumeroDocumento,
    string Nombres,
    string Apellidos,
    string Correo,
    int? CicloAcademico
);

public record ParticipantRecordDto(
    string NumeroDocumento,
    string TipoDocumento,
    string TipoParticipante,
    string Nombres,
    string Apellidos,
    string Correo,
    int? CicloAcademico,
    DateTime? FechaHoraRegistro,
    DateTime? FechaHoraMarcacion,
    string Estado
);

public record ConferenceReportDto(
    ConferenceSummaryDto Conferencia,
    int TotalInscritos,
    int TotalAsistentes,
    int TotalAcreditados,
    int TotalEspontaneos,
    int TotalInasistencias,
    List<ParticipantRecordDto> Participantes
);
