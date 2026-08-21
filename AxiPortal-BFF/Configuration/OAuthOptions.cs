namespace AxiPortal.BFF.Configuration;

/// <summary>
/// Bound from appsettings "OAuth" section.
///
/// SECURITY TIERS:
///   Public  (safe to send to browser via /api/oauth/config):
///     Google.ClientId, Office365.ClientId, Office365.TenantId,
///     Supabase.Url, Supabase.AnonKey
///
///   Server-only (NEVER leaves the server):
///     Supabase.ServiceRoleKey
///
/// Environment variable overrides:
///   OAuth__Google__ClientId=xxx
///   OAuth__Supabase__ServiceRoleKey=xxx   ← production only, not in source
/// </summary>
public sealed class OAuthOptions
{
    public const string Section = "OAuth";

    public GoogleOAuthConfig   Google   { get; init; } = new();
    public Office365OAuthConfig Office365 { get; init; } = new();
    public SupabaseOAuthConfig Supabase { get; init; } = new();

    /// <summary>
    /// Safe subset served to the browser.
    /// ServiceRoleKey is structurally excluded – it cannot accidentally be added.
    /// </summary>
    public object ToPublicConfig() => new
    {
        google = new
        {
            clientId = Google.ClientId
        },
        office365 = new
        {
            clientId = Office365.ClientId,
            tenantId = Office365.TenantId
        },
        supabase = new
        {
            url     = Supabase.Url,
            //anonKey = Supabase.AnonKey,
            publicKey = Supabase.PublicKey
            // ServiceRoleKey: deliberately absent
        }
    };
}

public sealed class GoogleOAuthConfig
{
    public string ClientId { get; init; } = string.Empty;
    // No ClientSecret needed: we validate access_tokens via the userinfo endpoint,
    // not via authorization-code exchange. The token flow is initiated client-side.
}

public sealed class Office365OAuthConfig
{
    public string ClientId { get; init; } = string.Empty;
    public string TenantId { get; init; } = "common";
}

public sealed class SupabaseOAuthConfig
{
    public string Url            { get; init; } = string.Empty;
    //public string AnonKey        { get; init; } = string.Empty;  // safe for browser
    public string PublicKey      { get; init; } = string.Empty;  // safe for browser
    public string ServiceRoleKey { get; init; } = string.Empty;  // SERVER-ONLY, env var only
}
