namespace MedLib.Api.Features.Newsletter.Dtos;

public record SubscriberDto(
    int IdSuscriptor,
    string CorreoInstitucional,
    string NivelAcademico,
    DateTimeOffset FechaSuscripcion,
    bool EstadoActivo
);
