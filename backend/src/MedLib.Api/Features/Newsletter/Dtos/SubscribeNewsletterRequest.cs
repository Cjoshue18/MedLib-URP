namespace MedLib.Api.Features.Newsletter.Dtos;

public record SubscribeNewsletterRequest(
    string CorreoInstitucional,
    string NivelAcademico
);
