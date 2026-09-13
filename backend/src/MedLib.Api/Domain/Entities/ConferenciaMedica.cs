namespace MedLib.Api.Domain.Entities;

public class ConferenciaMedica
{
    public int IdConferencia { get; set; }
    public string TituloEvento { get; set; } = string.Empty;
    public string ExpositorPonente { get; set; } = string.Empty;
    public string EntidadEditorial { get; set; } = string.Empty;
    public DateTime FechaHoraInicio { get; set; }
    public DateTime FechaHoraFin { get; set; }
    public string Modalidad { get; set; } = "Virtual";
    public string? EnlaceVirtual { get; set; }
    public bool AsistenciaAbierta { get; set; } = false;
    public string EstadoEvento { get; set; } = "Programada";
    public bool AutoPurgar30Dias { get; set; } = true;
    public DateTime? FechaCaducidadPurge { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
    public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();
}
