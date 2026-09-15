namespace MedLib.Api.Features.Newsletter.Dtos;

public record NewsletterStatsDto(
    int TotalSuscriptores,
    int Pregrado,
    int Posgrado,
    int Residentado
);
