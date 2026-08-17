using System.ComponentModel.DataAnnotations;

namespace AxiPortal.BFF.Models.Requests;

public sealed record GoogleCallbackRequest(
    [Required, MinLength(20)] string AccessToken,
    bool IsSignup = false
);

public sealed record MicrosoftCallbackRequest(
    [Required, MinLength(20)] string AccessToken,
    bool IsSignup = false
);

public sealed record SupabaseCallbackRequest(
    [Required, MinLength(20)] string AccessToken,
    [Required, MaxLength(50)] string Provider,
    bool IsSignup = false
);