namespace MedLib.Api.Domain.Entities;

public class Asistencia
{
    public int IdAsistencia { get; set; }
    public int IdConferencia { get; set; }
    public string TipoParticipante { get; set; } = "Estudiante";
    public string TipoDocumento { get; set; } = "CODIGO_URP";
    public string NumeroDocumento { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public int? CicloAcademico { get; set; }
    public DateTime FechaHoraMarcacion { get; set; } = DateTime.UtcNow;
    public bool EsAsistenciaValida { get; set; } = true;

    public ConferenciaMedica? Conferencia { get; set; }
}
