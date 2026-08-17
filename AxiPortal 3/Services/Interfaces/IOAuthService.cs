using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;

namespace AxiPortal.BFF.Services.Interfaces;

public interface IOAuthService
{
    /// <summary>
    /// Validates Google access_token server-side, then runs the full SSO flow
    /// (signup OTP / login primary / login secondary) via IAuthService.
    /// </summary>
    Task<OAuthVerifyResult> ValidateGoogleAsync(GoogleCallbackRequest req, CancellationToken ct);

    /// <summary>
    /// Validates Microsoft MSAL access_token via Graph API, then runs the SSO flow.
    /// </summary>
    Task<OAuthVerifyResult> ValidateMicrosoftAsync(MicrosoftCallbackRequest req, CancellationToken ct);

    /// <summary>
    /// Validates Supabase session token server-side using service_role key, then runs the SSO flow.
    /// </summary>
    Task<OAuthVerifyResult> ValidateSupabaseAsync(SupabaseCallbackRequest req, CancellationToken ct);

    /// <summary>Returns only public OAuth config (client IDs). Never includes service role key.</summary>
    object GetPublicConfig();
}