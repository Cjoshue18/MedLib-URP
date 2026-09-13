namespace MedLib.Api.Features.LostFound.Dtos;

public record LostItemPostDto(int Id, string UrlInstagram, DateTime FechaCreacion);

public record CreateLostItemPostRequest(string UrlInstagram);
