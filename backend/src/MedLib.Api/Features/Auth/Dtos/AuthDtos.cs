namespace MedLib.Api.Features.Auth.Dtos;

public record LoginRequest(string Username, string Password);

public record LoginResponse(
    string Token,
    string RefreshToken,
    string Username,
    string FullName,
    string Role,
    DateTime ExpiresAt,
    DateTime RefreshExpiresAt
);

public record RefreshTokenRequest(string RefreshToken);

public record TokenRefreshResponse(
    string Token,
    string RefreshToken,
    DateTime ExpiresAt,
    DateTime RefreshExpiresAt
);

public record RevokeTokenRequest(string RefreshToken);

public record AdminUserProfileDto(
    int Id,
    string Username,
    string FullName,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);
