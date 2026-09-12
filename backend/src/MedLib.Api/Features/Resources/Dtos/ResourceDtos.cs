namespace MedLib.Api.Features.Resources.Dtos;

public record SubjectDto(int Id, string Name);

public record TutorialDto(int Id, string VideoTitle, string YoutubeVideoId, string? GuidePdfUrl);

public record ResourceSummaryDto(
    int Id,
    string Name,
    string LogoUrl,
    string ClinicalDescription,
    bool IsSubscription,
    bool HasMobileApp,
    string? ExternalUrl,
    bool IsActive,
    List<string> Subjects,
    TutorialDto? Tutorial
);

public record CreateResourceRequest(
    string Name,
    string LogoUrl,
    string ClinicalDescription,
    bool IsSubscription,
    bool HasMobileApp,
    string? ExternalUrl,
    List<string> Subjects,
    string? YoutubeVideoId,
    string? VideoTitle,
    string? GuidePdfUrl
);

public record UpdateResourceRequest(
    string Name,
    string LogoUrl,
    string ClinicalDescription,
    bool IsSubscription,
    bool HasMobileApp,
    string? ExternalUrl,
    bool IsActive,
    List<string> Subjects,
    string? YoutubeVideoId,
    string? VideoTitle,
    string? GuidePdfUrl
);

public record UploadLogoResponse(string LogoUrl);
