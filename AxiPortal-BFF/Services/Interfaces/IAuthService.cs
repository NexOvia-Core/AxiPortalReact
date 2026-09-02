using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;

namespace AxiPortal.BFF.Services.Interfaces;

/// <summary>
/// All AxiClient proxy operations exposed by the BFF.
/// ARM layer is fully removed — every call targets AxiClient directly.
/// </summary>
public interface IAuthService
{
    // ── Email ─────────────────────────────────────────────────────────────────

    /// <summary>
    /// Validates email existence then sends OTP in one BFF call (credential flow).
    /// mode="signup" → email must NOT exist → purpose="signup"
    /// mode="login"  → email MUST exist     → purpose="login"
    /// </summary>
    Task<CheckAndSendOtpResult> CheckAndSendOtpAsync(CheckAndSendOtpRequest req, CancellationToken ct);

    /// <summary>
    /// Boolean email existence check used by OAuthService internally.
    /// Not exposed as a controller endpoint.
    /// </summary>
    Task<UserCheckResponse> EmailExistsAsync(EmailExistsRequest req, CancellationToken ct);

    // ── Verification ──────────────────────────────────────────────────────────

    /// <summary>
    /// Verifies OTP (or SSO key) via AxiVerifyUser.
    /// Stores token in Redis on success.
    /// For login: also fetches schema list and returns it.
    /// For signup: returns success only (no schemas needed yet).
    /// </summary>
    Task<VerifyUserResult> VerifyUserAsync(VerifyUserRequest req, CancellationToken ct);

    /// <summary>
    /// Fetches fresh schema list for the authenticated user.
    /// Called by OAuthService for SSO flows and exposed as a SECURE endpoint.
    /// </summary>
    Task<object> GetSchemaListAsync(GetSchemaListRequest req, CancellationToken ct);

    // ── SSO internal helpers (called by OAuthService) ─────────────────────────

    /// <summary>
    /// Executes the full SSO login or signup orchestration after provider token is validated.
    ///   Signup:          → AxiSendOTP → return challengeId
    ///   Login primary:   → AxiVerifyUser(SSO) → store token → fetch schemas
    ///   Login secondary: → AxiUserCheck(TokenRequired) → store token → fetch schemas
    /// </summary>
    Task<SsoFlowResult> HandleSsoFlowAsync(
        string email, string ssoKey, string ssoProvider,
        bool isSignup, CancellationToken ct);

    // ── Account ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Creates account + user + admin queue in one AxiClient call (AddAxiAccount).
    /// schemaName derived server-side; databaseName from Axi:SharedDatabase config.
    /// SECURE — requires valid session token.
    /// </summary>
    Task<object> SetupAccountAsync(SetupAccountRequest req, CancellationToken ct);

    /// <summary>Checks whether an AxiAccId is available.</summary>
    Task<object> CheckAccountAsync(CheckAccountRequest req, CancellationToken ct);

    // ── Secure post-auth actions ──────────────────────────────────────────────

    /// <summary>Updates SSO auth/verification status. SECURE.</summary>
    Task<object> AuthUpdateAsync(AuthUpdateRequest req, CancellationToken ct);

    /// <summary>Returns AES-encrypted redirect URL. SECURE.</summary>
    Task<EncryptUrlResult> GetSigninInfoAsync(SigninInfoRequest req, CancellationToken ct, string? tokenOverride = null);
    Task<EncryptUrlResult> FallBackSigninInfoAsync(SigninInfoRequest req, CancellationToken ct);

    Task<DirectLoginResult> DirectLoginAsync(DirectLoginRequest req, CancellationToken ct);
    Task<GetRedirectUrlResult> GetCurrentSessionRedirectUrlAsync(CancellationToken ct);
    Task<ProvisioningStatusResult> GetProvisioningStatusAsync(CancellationToken ct);
    Task<VerifyUserResult> VerifyAndSendSchemasAsync(VerifyAndSendSchemasRequest req, CancellationToken ct);
    Task<object> GetKeepMeSignin(KeepMeSigninListRequest req, CancellationToken ct);
    Task<EncryptUrlResult> KeepMeSignInAsync(KeepMeSignInRequest req, CancellationToken ct);
    Task<EncryptUrlResult> KeepMeSigninConfirmAsync(KeepMeSigninConfirmRequest req, CancellationToken ct);
}
