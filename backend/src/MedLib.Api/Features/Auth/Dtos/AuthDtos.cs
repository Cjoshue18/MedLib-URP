namespace MedLib.Api.Features.Auth.Dtos;

public record LoginRequest(string Username, string Password);

public record LoginResponse(
    string Token,
    string Username,
    string FullName,
    string Role,
    DateTime ExpiresAt
);

public record AdminUserProfileDto(
    int Id,
    string Username,
    string FullName,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);
