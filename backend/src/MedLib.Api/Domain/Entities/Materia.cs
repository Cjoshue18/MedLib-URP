namespace MedLib.Api.Domain.Entities;

public class Materia
{
    public int IdMateria { get; set; }
    public string NombreMateria { get; set; } = string.Empty;

    public ICollection<BaseRelacionMateria> RelacionesMateria { get; set; } = new List<BaseRelacionMateria>();
}
