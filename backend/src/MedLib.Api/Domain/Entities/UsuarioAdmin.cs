namespace MedLib.Api.Domain.Entities;

public class UsuarioAdmin
{
    public int IdUsuarioAdmin { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string Rol { get; set; } = "Asistente";
    public bool EstadoActivo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
