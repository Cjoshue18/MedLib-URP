namespace MedLib.Api.Domain.Entities;

public class BaseRelacionMateria
{
    public int IdBaseDatos { get; set; }
    public BaseDatosMedica BaseDatos { get; set; } = null!;

    public int IdMateria { get; set; }
    public Materia Materia { get; set; } = null!;
}
