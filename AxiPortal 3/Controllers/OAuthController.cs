using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AxiPortal.BFF.Controllers;

/// <summary>
/// OAuth endpoints — provider token validation + full SSO flow orchestration.
///
/// ENDPOINT MAP:
///   GET  /api/oauth/config            → public OAuth config (client IDs only)
///   POST /api/oauth/google            → validate Google token + run SSO flow
///   POST /api/oauth/microsoft         → validate MS token + run SSO flow
///   POST /api/oauth/supabase          → validate Supabase token + run SSO flow
///
/// Each POST endpoint:
///   • Validates the access_token server-to-server with the provider
///   • Runs the appropriate AxiClient flow (signup OTP / primary login / secondary login)
///   • Returns OAuthVerifyResult with NextAction for the browser to route the UI
///
/// WHAT STAYS CLIENT-SIDE (browser SDK requirement, cannot move):
///   Google initTokenClient().requestAccessToken()   — popup
///   MSAL loginPopup()                               — popup
///   Supabase signInWithOAuth() + onAuthStateChange  — redirect + listener
/// </summary>
[ApiController]
[Route("api/oauth")]
[Produces("application/json")]
public sealed class OAuthController(
    IOAuthService oauthService,
    ILogger<OAuthController> logger) : ControllerBase
{
    // GET /api/oauth/config
    // Serves public OAuth config. Replaces axiglobalconfig.json OAuth section.
    [HttpGet("config")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public IActionResult GetConfig() =>
        Ok(ApiResponse<object>.Ok(oauthService.GetPublicConfig()));

    // POST /api/oauth/google
    // Browser sends: { accessToken, isSignup }
    // BFF returns:   OAuthVerifyResult with nextAction
    [HttpPost("google")]
    [ProducesResponseType(typeof(ApiResponse<OAuthVerifyResult>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> Google(
        [FromBody] GoogleCallbackRequest req, CancellationToken ct)
    {
        logger.LogInformation("Google OAuth [{Mode}]", req.IsSignup ? "signup" : "login");
        var result = await oauthService.ValidateGoogleAsync(req, ct);
        return Ok(ApiResponse<OAuthVerifyResult>.Ok(result));
    }

    // POST /api/oauth/microsoft
    [HttpPost("microsoft")]
    [ProducesResponseType(typeof(ApiResponse<OAuthVerifyResult>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> Microsoft(
        [FromBody] MicrosoftCallbackRequest req, CancellationToken ct)
    {
        logger.LogInformation("Microsoft OAuth [{Mode}]", req.IsSignup ? "signup" : "login");
        var result = await oauthService.ValidateMicrosoftAsync(req, ct);
        return Ok(ApiResponse<OAuthVerifyResult>.Ok(result));
    }

    // POST /api/oauth/supabase
    [HttpPost("supabase")]
    [ProducesResponseType(typeof(ApiResponse<OAuthVerifyResult>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> Supabase(
        [FromBody] SupabaseCallbackRequest req, CancellationToken ct)
    {
        logger.LogInformation("Supabase OAuth [{Mode}] provider={Provider}",
            req.IsSignup ? "signup" : "login", req.Provider);
        var result = await oauthService.ValidateSupabaseAsync(req, ct);
        return Ok(ApiResponse<OAuthVerifyResult>.Ok(result));
    }
}