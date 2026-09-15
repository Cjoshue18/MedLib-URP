namespace MedLib.Api.Domain.Entities;

public class SuscriptorBoletin
{
    public int IdSuscriptor { get; set; }
    public string CorreoInstitucional { get; set; } = string.Empty;
    public string NivelAcademico { get; set; } = string.Empty;
    public DateTime FechaSuscripcion { get; set; } = DateTime.UtcNow;
    public bool EstadoActivo { get; set; } = true;
}
