namespace MedLib.Api.Domain.Entities;

public class BaseDatosMedica
{
    public int IdBaseDatos { get; set; }
    public string NombreRecurso { get; set; } = string.Empty;
    public string LogotipoUrl { get; set; } = string.Empty;
    public string DescripcionClinica { get; set; } = string.Empty;
    public bool EsSuscripcion { get; set; } = true;
    public bool TieneAppMovil { get; set; } = false;
    public string? UrlExterno { get; set; }
    public bool EstadoActivo { get; set; } = true;
    public bool MostrarEnHexagonos { get; set; } = false;

    public ICollection<BaseRelacionMateria> RelacionesMateria { get; set; } = new List<BaseRelacionMateria>();
    public TutorialRecurso? Tutorial { get; set; }
}
