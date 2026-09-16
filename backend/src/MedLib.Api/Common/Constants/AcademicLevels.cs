namespace MedLib.Api.Common.Constants;

public static class AcademicLevels
{
    public const string Pregrado = "Pregrado";
    public const string Posgrado = "Posgrado";
    public const string Residentado = "Residentado";
    public const string Docente = "Docente";
    public const string Otro = "Otro";

    public static readonly string[] All = [Pregrado, Posgrado, Residentado, Docente, Otro];

    public static string Normalize(string? raw)
    {
        var clean = raw?.Trim().ToLowerInvariant() ?? string.Empty;
        return clean switch
        {
            "pregrado" or "estudiante" => Pregrado,
            "posgrado" or "postgrado" => Posgrado,
            "residentado" => Residentado,
            "docente" or "profesor" => Docente,
            _ => Otro
        };
    }
}
