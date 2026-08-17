using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Exceptions;
using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;

namespace AxiPortal.BFF.Services;

/// <summary>
/// Server-side OAuth token validation + SSO flow orchestration.
///
/// RESPONSIBILITY SPLIT:
///   OAuthService  → validates access_token with provider (Google/MS/Supabase)
///                    extracts verified identity (email, name, sub)
///   AuthService   → handles all AxiClient calls (email check, OTP, verify, schemas)
///
/// FLOW:
///   1. Validate access_token server-to-server → get verified email
///   2. Delegate to IAuthService.HandleSsoFlowAsync
///   3. Return OAuthVerifyResult with NextAction for the browser
///
/// SECURITY: The browser never sends a self-reported email for identity.
///           It sends only the raw access_token. The provider's response is authoritative.
/// </summary>
public sealed class OAuthService(
    IHttpClientFactory factory,
    IAuthService authService,
    IOptions<OAuthOptions> options,
    ILogger<OAuthService> logger) : IOAuthService
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);
    private readonly OAuthOptions _opts = options.Value;

    // ── Google ────────────────────────────────────────────────────────────────
    public async Task<OAuthVerifyResult> ValidateGoogleAsync(
        GoogleCallbackRequest data, CancellationToken ct)
    {
        logger.LogInformation("Validating Google access_token server-side.");

        var client = factory.CreateClient("GoogleApis");

        using var req = new HttpRequestMessage(HttpMethod.Get, "oauth2/v3/userinfo");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", data.AccessToken);

        var body = await SendAndReadAsync(client, req, "Google", ct);

        var email = GetRequired(body, "email", "Google did not return an email.");
        var name = Get(body, "name") ?? Get(body, "given_name") ?? "User";
        var sub = Get(body, "sub") ?? string.Empty;
        var verified = body.TryGetProperty("email_verified", out var v) && v.GetBoolean();

        logger.LogInformation("Google identity validated for {Email}", Mask(email));
        return await BuildResultAsync(email, name, sub, verified, "google", data.IsSignup, ct);
    }

    // ── Microsoft ─────────────────────────────────────────────────────────────
    public async Task<OAuthVerifyResult> ValidateMicrosoftAsync(
        MicrosoftCallbackRequest data, CancellationToken ct)
    {
        logger.LogInformation("Validating Microsoft access_token server-side.");

        var client = factory.CreateClient("MicrosoftGraph");

        using var req = new HttpRequestMessage(HttpMethod.Get, "v1.0/me");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", data.AccessToken);

        var body = await SendAndReadAsync(client, req, "Microsoft", ct);

        // Graph: work accounts return "mail"; personal/school return "userPrincipalName"
        var email = Get(body, "mail") ?? Get(body, "userPrincipalName")
            ?? throw new UpstreamApiException("Microsoft Graph did not return an email.", 502);

        var name = Get(body, "displayName") ?? email;
        var sub = Get(body, "id") ?? string.Empty;

        logger.LogInformation("Microsoft identity validated for {Email}", Mask(email));
        return await BuildResultAsync(email, name, sub, isEmailVerified: true, "office365", data.IsSignup, ct);
    }

    // ── Supabase (GitHub / LinkedIn / other providers) ────────────────────────
    public async Task<OAuthVerifyResult> ValidateSupabaseAsync(
        SupabaseCallbackRequest data, CancellationToken ct)
    {
        logger.LogInformation("Validating Supabase token for provider={Provider}", data.Provider);

        if (string.IsNullOrWhiteSpace(_opts.Supabase.Url))
            throw new ConfigurationException("Supabase URL is not configured (OAuth:Supabase:Url).");

        var client = factory.CreateClient("Supabase");
        //var apiKey = !string.IsNullOrWhiteSpace(_opts.Supabase.ServiceRoleKey)
        //    ? _opts.Supabase.ServiceRoleKey   // privileged server-only key
        //    : _opts.Supabase.PublicKey;
        var apiKey = _opts.Supabase.PublicKey;

        using var req = new HttpRequestMessage(HttpMethod.Get, "auth/v1/user");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", data.AccessToken);
        req.Headers.Add("apikey", apiKey);

        var body = await SendAndReadAsync(client, req, "Supabase", ct);

        var email = GetRequired(body, "email", "Supabase did not return an email.");
        var verified = body.TryGetProperty("email_confirmed_at", out var eca)
                    && eca.ValueKind != JsonValueKind.Null
                    && !string.IsNullOrWhiteSpace(eca.GetString());

        var name = "User";
        if (body.TryGetProperty("user_metadata", out var meta))
            name = Get(meta, "full_name") ?? Get(meta, "name")
                ?? Get(meta, "given_name") ?? Get(meta, "user_name") ?? "User";

        var sub = Get(body, "id") ?? string.Empty;

        logger.LogInformation("Supabase identity validated for {Email} via {Provider}",
            Mask(email), data.Provider);

        return await BuildResultAsync(email, name, sub, verified, data.Provider, data.IsSignup, ct);
    }

    // ── Public config ─────────────────────────────────────────────────────────
    public object GetPublicConfig() => _opts.ToPublicConfig();

    // ── Core orchestration ───────────────────────────────────────────────────

    /// <summary>
    /// After provider identity is verified, delegates to AuthService for all AxiClient calls.
    /// Returns OAuthVerifyResult with NextAction and appropriate data.
    /// </summary>
    private async Task<OAuthVerifyResult> BuildResultAsync(
        string email, string name, string sub, bool isEmailVerified,
        string provider, bool isSignup, CancellationToken ct)
    {
        // Check email existence in AxiClient
        var result = await authService.EmailExistsAsync(new EmailExistsRequest(email, isSignup), ct);

        // Validate mode vs email state
        if (isSignup && result.Success)
            throw new ValidationException("This email is already registered. Please log in.");

        if (!isSignup && !result.Success)
            throw new ValidationException(result.Message ?? "No account found for this email. Please sign up.");

        // Delegate full SSO AxiClient orchestration to AuthService
        var ssoResult = await authService.HandleSsoFlowAsync(
            email, sub, provider, isSignup, ct);

        return new OAuthVerifyResult
        {
            Email = email,
            Name = name,
            Sub = sub,
            IsEmailVerified = isEmailVerified,
            Provider = provider,
            NextAction = ssoResult.NextAction,
            ChallengeId = ssoResult.ChallengeId,
            ExpiresInSeconds = ssoResult.ExpiresInSeconds,
            ResendInSeconds = ssoResult.ResendInSeconds,
            Schemas = ssoResult.Schemas
        };
    }

    // ── HTTP helpers ──────────────────────────────────────────────────────────

    private static async Task<JsonElement> SendAndReadAsync(
        HttpClient client, HttpRequestMessage req, string providerName, CancellationToken ct)
    {
        HttpResponseMessage resp;
        try { resp = await client.SendAsync(req, ct); }
        catch (Exception ex)
        {
            throw new UpstreamApiException(
                $"Failed to reach {providerName} identity endpoint.", 502, ex.Message);
        }

        if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            throw new UpstreamApiException($"{providerName} token is invalid or expired.", 401);

        if (!resp.IsSuccessStatusCode)
            throw new UpstreamApiException(
                $"{providerName} token validation failed.", (int)resp.StatusCode);

        return await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOpts, ct);
    }

    private static string GetRequired(JsonElement el, string key, string errorMsg)
        => Get(el, key) ?? throw new UpstreamApiException(errorMsg, 502);

    private static string? Get(JsonElement el, string key)
        => el.TryGetProperty(key, out var p) && p.ValueKind == JsonValueKind.String
            ? p.GetString() : null;

    private static string Mask(string email)
    {
        var at = email.IndexOf('@');
        return at > 1
            ? email[0] + new string('*', Math.Min(at - 1, 4)) + email[at..]
            : "***";
    }
}