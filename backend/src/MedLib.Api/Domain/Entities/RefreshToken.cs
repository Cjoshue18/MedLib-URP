namespace MedLib.Api.Domain.Entities;

public class RefreshToken
{
    public int IdRefreshToken { get; set; }
    public int IdUsuarioAdmin { get; set; }
    public Guid FamilyId { get; set; }
    public string TokenHash { get; set; } = string.Empty;
    public DateTime FechaExpiracion { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string? CreadoPorIp { get; set; }
    public string? UserAgent { get; set; }
    public bool Revocado { get; set; }
    public DateTime? FechaRevocacion { get; set; }
    public string? ReemplazadoPorTokenHash { get; set; }
    public string? MotivoRevocacion { get; set; }

    public UsuarioAdmin UsuarioAdmin { get; set; } = null!;
}
