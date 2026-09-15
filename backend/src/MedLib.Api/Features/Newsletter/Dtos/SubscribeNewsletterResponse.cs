namespace MedLib.Api.Features.Newsletter.Dtos;

public record SubscribeNewsletterResponse(
    string Message,
    int IdSuscriptor,
    bool IsNew
);
