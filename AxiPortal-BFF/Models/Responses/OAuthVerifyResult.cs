namespace AxiPortal.BFF.Models.Responses;

/// <summary>
/// Server-authoritative result after full SSO token validation and AxiClient flow.
/// The browser receives ONLY this shape — no raw tokens, no provider secrets.
///
/// NextAction drives the client flow:
///   "otp-required"  → SSO signup or OTP-needed case; ChallengeId provided
///   "schema-ready"  → SSO primary login; token in Redis, schemas returned
///   "auth-update"   → SSO secondary user; token in Redis, AuthUpdate needed next
/// </summary>
public sealed class OAuthVerifyResult
{
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Sub { get; init; } = string.Empty;
    public bool IsEmailVerified { get; init; }
    public string Provider { get; init; } = string.Empty;
    public string NextAction { get; init; } = string.Empty;

    // Populated when NextAction = "otp-required"
    public string? ChallengeId { get; init; }
    public string? ExpiresInSeconds { get; init; }
    public string? ResendInSeconds { get; init; }

    // Populated when NextAction = "schema-ready" | "auth-update"
    public object? Schemas { get; init; }
}