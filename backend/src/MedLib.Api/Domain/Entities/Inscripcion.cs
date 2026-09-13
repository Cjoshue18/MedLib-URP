namespace MedLib.Api.Domain.Entities;

public class Inscripcion
{
    public int IdInscripcion { get; set; }
    public int IdConferencia { get; set; }
    public string TipoParticipante { get; set; } = "Estudiante";
    public string TipoDocumento { get; set; } = "CODIGO_URP";
    public string NumeroDocumento { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public int? CicloAcademico { get; set; }
    public DateTime FechaHoraRegistro { get; set; } = DateTime.UtcNow;

    public ConferenciaMedica? Conferencia { get; set; }
}
