namespace AxiPortal.BFF.Models.Responses;

public sealed record DirectLoginResult(
    bool Success,
    string? RedirectUrl,
    string? Error
);
public sealed record GetRedirectUrlResult(
    bool Success,
    string? RedirectUrl,
    string? Error
);

public sealed record EncryptUrlResult(
    bool Success,
    string? RedirectUrl,
    string? Error
);

public sealed record CheckAndSendOtpResult(
    bool Success,
    string? ChallengeId,
    string? ExpiresInSeconds,
    string? ResendInSeconds,
    string? Message
);

public sealed record VerifyUserResult(
    bool Success,
    string? Message,
    object? Schemas   // null for signup; populated for login
);

public sealed record UserCheckResponse(
    bool Success,
    string? Message
);

public sealed record SsoFlowResult(
    string NextAction,         // "otp-required" | "schema-ready" | "auth-update"
    string? ChallengeId = null,
    string? ExpiresInSeconds = null,
    string? ResendInSeconds = null,
    object? Schemas = null
);