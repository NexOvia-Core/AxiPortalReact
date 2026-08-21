using System.ComponentModel.DataAnnotations;

namespace AxiPortal.BFF.Models.Requests;

// ── Credential flow ───────────────────────────────────────────────────────────

/// <summary>
/// Combined email-check + OTP dispatch (credential flow).
/// BFF validates email existence based on mode, then sends OTP.
/// mode = "signup" → email must NOT exist → OTP purpose = "signup"
/// mode = "login"  → email MUST exist     → OTP purpose = "login"
/// </summary>
public sealed record CheckAndSendOtpRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    [Required] //, AllowedValues("signup" , "login", ErrorMessage = "Invalid Mode.")] 
    string Mode
);

public sealed record EmailExistsRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    [Required] //, AllowedValues("signup" , "login", ErrorMessage = "Invalid Mode.")] 
    bool IsSignUp
);

public sealed record VerifyAndSendSchemasRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email
);

/// <summary>
/// OTP + SSO verification against AxiVerifyUser.
/// For OTP: provide Otp + ChallengeId.
/// For SSO (via OAuthService internally): provide SsoKey + SsoProvider.
/// Purpose drives schema-list fetching: login = fetch schemas, signup = skip.
/// </summary>
public sealed record VerifyUserRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    [Required] //, AllowedValues("signup" , "login", ErrorMessage = "Invalid Mode.")] 
    string Purpose,
    //[MaxLength(6)] 
    string? Otp,
    //[MaxLength(256)] 
    string? ChallengeId,
    //[MaxLength(512)] 
    string? SsoKey,
    //[AllowedValues("google" , "office365", "linkedin_oidc", "github", "", ErrorMessage = "Invalid Provider.")] 
    string? SsoProvider
);

/// <summary>
/// Push user data to admin queue.
/// schemaName is derived server-side (axiAccId.ToLower()).
/// databaseName is read from Axi:SharedDatabase config.
/// sessionId is read from request cookies.
/// </summary>
public sealed record SetupAccountRequest(
    [Required] //, MinLength(2), MaxLength(100)] 
    string OrgName,
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    [Required] //, MinLength(5), MaxLength(16), RegularExpression(@"^[A-Za-z]{5}[A-Za-z0-9]{0,11}$", ErrorMessage = "Invalid AxiAccount Id.")] 
    string AxiAccId,
    [Required] //, MinLength(3), MaxLength(32), RegularExpression(@"^[A-Za-z0-9_.-]+$", ErrorMessage = "Username may contain only letters, numbers, '_' and '-'.")] 
    string UserName,
    //[MaxLength(30)] 
    string? NickName,
    //[MaxLength(50)] 
    string? ContactPersonName,
    //[MaxLength(20)] 
    string? MobileNo,
    //[MaxLength(30)] 
    string? TaxNo,
    //[MaxLength(50)] 
    string? State,
    //[MaxLength(60)] 
    string? Country,
    //[MaxLength(500)] 
    string? Address,
    //[MaxLength(5)] 
    string? CountryCode,
    //[MaxLength(50)] 
    string? Region,
    //[AllowedValues("google" , "office365", "linkedin_oidc", "github", "credential", "", ErrorMessage = "Invalid Provider.")] 
    string? AuthProvider,
    //[MaxLength(512)] 
    string? SsoId,
    //[AllowedValues("T", "F", "", ErrorMessage = "Invalid value.")]
    string? IsVerified  // "T" for SSO users, "F" for credential
);

public sealed record CheckAccountRequest(
    [Required] //, MinLength(5), MaxLength(16), RegularExpression(@"^[A-Za-z]{5}[A-Za-z0-9]{0,11}$", ErrorMessage = "Invalid AxiAccount Id.")] 
    string AxiAccId);

public sealed record AuthUpdateRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    [Required] //, MinLength(5), MaxLength(16), RegularExpression(@"^[A-Za-z]{5}[A-Za-z0-9]{0,11}$", ErrorMessage = "Invalid AxiAccount Id.")] 
    string AxiAccId,
    [Required] //, MaxLength(512)] 
    string SsoKey,
    [Required] //, AllowedValues("google" , "office365", "linkedin_oidc", "github", ErrorMessage = "Invalid Provider.")]
    string SsoProvider
);

public sealed record SigninInfoRequest(
    [Required] //, MinLength(5), MaxLength(16), RegularExpression(@"^[A-Za-z]{5}[A-Za-z0-9]{0,11}$", ErrorMessage = "Invalid schema name.")] 
    string SchemaName, 
    [Required] //, MinLength(3), MaxLength(32), RegularExpression(@"^[A-Za-z0-9_-]+$", ErrorMessage = "Invalid Username")] 
    string UserName,
    [Required] //, MaxLength(256)] 
    string Email,
    //[AllowedValues("T", "F", "", ErrorMessage = "Invalid value.")]
    string? IsPrimary,
    bool? KeepMeSignIn,
    string? Password,
    string? BrId,
    string? InstalledPackages
);

public sealed record KeepMeSignInRequest(
    [Required] //, MinLength(5), MaxLength(16), RegularExpression(@"^[A-Za-z]{5}[A-Za-z0-9]{0,11}$", ErrorMessage = "Invalid schema name.")] 
    string SchemaName,
    [Required] //, MinLength(3), MaxLength(32), RegularExpression(@"^[A-Za-z0-9_-]+$", ErrorMessage = "Invalid Username")] 
    string UserName,
    [Required] //, MaxLength(256)] 
    string Email,
    string? Password,
    //[AllowedValues("T", "F", "", ErrorMessage = "Invalid value.")]
    string? IsPrimary,
    [Required] //, MaxLength(256)] 
    string BrId
);

public sealed record GetSchemaListRequest(
    [Required] //, EmailAddress, MaxLength(256)] 
    string Email,
    string? DirectToken
);

public sealed class DirectLoginRequest
{
    public string? SessionId { get; set; } = string.Empty;
    public string? BrId { get; set; } = string.Empty;
}

public sealed record KeepMeSigninListRequest([Required] string BrId);
public sealed record KeepMeSigninConfirmRequest(
    [Required] string BrId,
    [Required] //, MinLength(3), MaxLength(32), RegularExpression(@"^[A-Za-z0-9_-]+$", ErrorMessage = "Invalid Username")] 
    string UserName
);