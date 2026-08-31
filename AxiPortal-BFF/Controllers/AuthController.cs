using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AxiPortal.BFF.Controllers;

/// <summary>
/// BFF Auth endpoints — all credential and account operations.
///
/// ENDPOINT MAP:
///   POST /api/auth/check-send-otp   → email validation + OTP dispatch (credential flow)
///   POST /api/auth/verify-user      → OTP/SSO verification + token storage [→ schemas for login]
///   POST /api/auth/add-account      → create account+user+queue in one call [SECURE]
///   POST /api/auth/check-account    → AxiAccId availability check
///   GET  /api/auth/schema-list      → get user's schema list [SECURE]
///   POST /api/auth/auth-update      → update SSO auth status [SECURE]
///   POST /api/auth/signin-info      → get AES-encrypted redirect URL [SECURE]
///   POST /api/auth/logout           → clear Redis token + session cookie
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public sealed class AuthController(IAuthService authService, ILogger<AuthController> logger)
    : ControllerBase
{
    // POST /api/auth/check-send-otp
    // Validates email existence for the given mode, then sends OTP — one browser call.
    [HttpPost("check-send-otp")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CheckAndSendOtp(
        [FromBody] CheckAndSendOtpRequest req, CancellationToken ct)
    {
        logger.LogInformation("CheckAndSendOtp [{Mode}] for {Email}", req.Mode, Mask(req.Email));

        var result = await authService.CheckAndSendOtpAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Message ?? "Failed.", "EMAIL_ERROR"));

        return Ok(ApiResponse<object>.Ok(new
        {
            challengeId = result.ChallengeId,
            expiresInSeconds = result.ExpiresInSeconds,
            resendInSeconds = result.ResendInSeconds
        }));
    }

    // POST /api/auth/verify-email-schemas
    // Validates email existence in login, then sends schemas — one browser call.
    [HttpPost("verify-email-schemas")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> VerifyAndSendSchemas(
        [FromBody] VerifyAndSendSchemasRequest req, CancellationToken ct)
    {
        logger.LogInformation("VerifyAndSendSchemas for {Email}", Mask(req.Email));

        var result = await authService.VerifyAndSendSchemasAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Message ?? "Failed.", "EMAIL_ERROR"));

        return Ok(ApiResponse<object>.Ok(result?.Schemas != null ? new { schemas = result.Schemas } : new { }, "Verification success."));

    }

    // POST /api/auth/verify-user
    // Verifies OTP (or SSO). Stores token in Redis. Returns schemas for login flow.
    [HttpPost("verify-user")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> VerifyUser(
        [FromBody] VerifyUserRequest req, CancellationToken ct)
    {
        logger.LogInformation("VerifyUser [{Purpose}] for {Email}", req.Purpose, Mask(req.Email));

        var result = await authService.VerifyUserAsync(req, ct);

        if (!result.Success)
            return Unauthorized(ApiResponse<object>.Fail(result.Message ?? "Verification failed.", "VERIFY_FAILED"));

        //return Ok(ApiResponse<object>.Ok(new { }, "Verification success."));
        return Ok(ApiResponse<object>.Ok(result?.Schemas != null ? new { schemas = result.Schemas } : new { }, "Verification success."));

    }

    // POST /api/auth/setup-account  [SECURE]
    // Push data to admin queue.
    [HttpPost("setup-account")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> SetupAccount(
        [FromBody] SetupAccountRequest req, CancellationToken ct)
    {
        logger.LogInformation("SetupAccount AxiAccId={Id} for {Email}", req.AxiAccId, Mask(req.Email));
        var data = await authService.SetupAccountAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data, "Account creation initialized successfully."));
    }

    // POST /api/auth/check-account
    // Checks if an AxiAccId is available (no auth required).
    [HttpPost("check-account")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> CheckAccount(
        [FromBody] CheckAccountRequest req, CancellationToken ct)
    {
        var data = await authService.CheckAccountAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // GET /api/auth/schema-list?email=...  [SECURE]
    // Returns fresh schema list. Used after AuthUpdate or when browser needs to refresh.
    [HttpGet("schema-list")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> SchemaList(
        [FromBody] GetSchemaListRequest req,
        CancellationToken ct)
    {
        logger.LogInformation("SchemaList for {Email}", Mask(req.Email));
        var data = await authService.GetSchemaListAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/auth-update  [SECURE]
    // Updates SSO auth/verification status for secondary SSO users.
    [HttpPost("auth-update")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> AuthUpdate(
        [FromBody] AuthUpdateRequest req, CancellationToken ct)
    {
        logger.LogInformation("AuthUpdate for {User} schema={Schema}", req.Email, req.AxiAccId);
        var data = await authService.AuthUpdateAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/signin-info  [SECURE]
    // Returns AES-encrypted redirect URL to the main Axi app.
    [HttpPost("signin-info")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> SigninInfo(
        [FromBody] SigninInfoRequest req, CancellationToken ct)
    {
        logger.LogInformation("SigninInfo schema={Schema} user={User}", req.SchemaName, Mask(req.UserName));
        var data = await authService.GetSigninInfoAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/continue-axi  [SECURE]
    // Returns AES-encrypted redirect URL to the main Axi app.
    [HttpPost("fallback-signin-info")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> FallBackSigninInfo(
        [FromBody] SigninInfoRequest req, CancellationToken ct)
    {
        logger.LogInformation("Fall Back SigninInfo schema={Schema} user={User}", req.SchemaName, Mask(req.UserName));
        var data = await authService.FallBackSigninInfoAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/direct-login [SECURE]
    // Returns AES-encrypted query with full URL for redirect to the main Axi app.
    [HttpPost("direct-login")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> DirectLogin([FromBody] DirectLoginRequest req, CancellationToken ct)
    {
        //logger.LogInformation("SigninInfo schema={Schema} user={User}", req.SchemaName, Mask(req.UserName));
        var data = await authService.DirectLoginAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/provision-status [SECURE]
    // Checks provisioning state without generating an application redirect URL.
    [HttpPost("provision-status")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> ProvisionStatus(CancellationToken ct)
    {
        var data = await authService.GetProvisioningStatusAsync(ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/keepme-signin [SECURE]
    // Returns AES-encrypted query with full URL for redirect to the main Axi app.
    [HttpPost("keepme-signin")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> KeepMeSignIn([FromBody] KeepMeSigninConfirmRequest req, CancellationToken ct)
    {
        var data = await authService.KeepMeSigninConfirmAsync(req, ct);
        return Ok(ApiResponse<object>.Ok(data));
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> Logout(
        [FromServices] ITokenStore tokenStore, CancellationToken ct)
    {
        await tokenStore.ClearAsync(ct);
        logger.LogInformation("User logged out – Redis token cleared, cookie expired.");
        return Ok(ApiResponse<object>.Ok(new { }, "Logged out successfully."));
    }

    [HttpPost("keepme-signin-list")]
    public async Task<IActionResult> GetKeepMeSignin([FromBody] KeepMeSigninListRequest req, CancellationToken ct)
    {
        var result = await authService.GetKeepMeSignin(req, ct);
        return Ok(ApiResponse<object>.Ok(result));
    }

    private static string Mask(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "[empty]";
        var at = value.IndexOf('@');
        if (at > 1) return value[0] + new string('*', Math.Min(at - 1, 4)) + value[at..];
        return value.Length > 2 ? value[0] + "***" + value[^1] : "***";
    }
}
