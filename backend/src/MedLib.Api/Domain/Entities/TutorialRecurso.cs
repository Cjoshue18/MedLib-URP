namespace MedLib.Api.Domain.Entities;

public class TutorialRecurso
{
    public int IdTutorial { get; set; }
    public int IdBaseDatos { get; set; }
    public BaseDatosMedica BaseDatos { get; set; } = null!;

    public string TituloVideo { get; set; } = string.Empty;
    public string YoutubeVideoId { get; set; } = string.Empty;
    public string? GuiaPdfUrl { get; set; }
}
