namespace MedLib.Api.Domain.Entities;

public class ObjetoPerdidoPost
{
    public int IdPost { get; set; }
    public string UrlInstagram { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
