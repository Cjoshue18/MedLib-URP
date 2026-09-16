namespace MedLib.Api.Common.Validation;

public static class ParticipantDocumentValidator
{
    public static string? Validate(
        string? tipoParticipante,
        string? tipoDocumento,
        string? numeroDocumento,
        string? nombres,
        string? apellidos,
        string? correo,
        int? cicloAcademico)
    {
        if (string.IsNullOrWhiteSpace(nombres) || string.IsNullOrWhiteSpace(apellidos))
        {
            return "Los nombres y apellidos son obligatorios.";
        }

        if (string.IsNullOrWhiteSpace(correo) || !correo.Contains('@'))
        {
            return "Debe ingresar un correo electrónico válido.";
        }

        var doc = numeroDocumento?.Trim() ?? string.Empty;
        var tipoDoc = tipoDocumento?.Trim().ToUpperInvariant() ?? string.Empty;

        if (tipoDoc == "DNI")
        {
            if (doc.Length != 8 || !doc.All(char.IsDigit))
            {
                return "El DNI debe contener exactamente 8 dígitos numéricos.";
            }
        }
        else if (tipoDoc == "CODIGO_URP")
        {
            if (doc.Length != 9 || !doc.All(char.IsDigit))
            {
                return "El Código Universitario URP debe contener exactamente 9 dígitos numéricos.";
            }
        }
        else if (tipoDoc == "CE")
        {
            if (doc.Length != 9)
            {
                return "El Carné de Extranjería (CE) debe contener exactamente 9 caracteres.";
            }
        }
        else
        {
            if (doc.Length < 8 || doc.Length > 20)
            {
                return "El documento debe contener entre 8 y 20 caracteres.";
            }
        }

        var participantType = tipoParticipante?.Trim() ?? string.Empty;
        var isPregrado = participantType.Equals("Pregrado", StringComparison.OrdinalIgnoreCase) ||
                         participantType.Equals("Estudiante", StringComparison.OrdinalIgnoreCase);

        if (isPregrado)
        {
            if (!cicloAcademico.HasValue || cicloAcademico.Value < 1 || cicloAcademico.Value > 14)
            {
                return "Para estudiantes de pregrado, el ciclo académico debe ser un número entre 1 y 14.";
            }
        }

        return null;
    }
}
