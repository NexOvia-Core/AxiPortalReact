using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Exceptions;
using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text.Json;

namespace AxiPortal.BFF.Services;

/// <summary>
/// Redis-backed token store.
///
/// FLOW:
///   SetAsync  → generate sessionId (CSPRNG) → store JWT in Redis with TTL
///             → write sessionId into HttpOnly, Secure, SameSite=Strict cookie
///
///   GetAsync  → read sessionId from request cookie
///             → lookup JWT in Redis (returns null if missing or expired)
///
///   ClearAsync→ delete JWT from Redis → expire the cookie
///
/// The browser only ever sees the sessionId cookie.
/// The JWT never leaves the server.
/// </summary>
public sealed class RedisTokenStore(
    IDistributedCache redis,
    IHttpContextAccessor accessor,
    IOptions<SessionConfig> sessionOpts,
    IOptions<RedisConfig> redisOpts,
    IHostEnvironment environment,
    ILogger<RedisTokenStore> logger) : ITokenStore
{
    private static readonly JsonSerializerOptions _json =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private readonly TimeSpan _ttl =
        TimeSpan.FromMinutes(redisOpts.Value.AbsoluteTimeoutMinutes);

    private DistributedCacheEntryOptions CacheOpts => new()
    {
        AbsoluteExpirationRelativeToNow = _ttl
        //SlidingExpiration = _ttl
    };

    // ── Write ─────────────────────────────────────────────────────────────────
    public async Task SetAsync(SessionData session, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(session);
        if (string.IsNullOrWhiteSpace(session.Token))
            throw new ArgumentException("Token must not be empty.", nameof(session));

        var sessionId = GenerateSessionId();
        var redisKey = redisOpts.Value.RedisPrefix + sessionId;
        var payload = JsonSerializer.Serialize(session, _json);

        await redis.SetStringAsync(redisKey, payload, CacheOpts, ct);

        Ctx.Response.Cookies.Append(sessionOpts.Value.CookieName, sessionId, new CookieOptions
        {
            HttpOnly = true,
            Secure = UseSecureCookies,
            SameSite = SameSiteMode.Strict,
            MaxAge = _ttl,
            Path = "/"
        });

        logger.LogInformation("Session created for {Email}. TTL={TTL}min",
            session.Email, _ttl.TotalMinutes);
    }

    // ── Read ──────────────────────────────────────────────────────────────────
    public async Task<SessionData?> GetAsync(CancellationToken ct = default, string directSessionId = "")
    {
        string sessionId = "";
        if (string.IsNullOrEmpty(directSessionId))
        {
            if (!Ctx.Request.Cookies.TryGetValue(sessionOpts.Value.CookieName, out sessionId)
                || string.IsNullOrWhiteSpace(sessionId))
            {
                logger.LogDebug("No session cookie present.");
                return null;
            }

        }
        else sessionId = directSessionId;

        var raw = await redis.GetStringAsync(redisOpts.Value.RedisPrefix + sessionId, ct);

        if (raw is null)
        {
            logger.LogWarning("Session {Prefix}*** not found in Redis.",
                sessionId[..Math.Min(8, sessionId.Length)]);
            return null;
        }

        return JsonSerializer.Deserialize<SessionData>(raw, _json);
    }

    // ── Patch (add/edit fields without replacing the whole object) ────────────
    public async Task<bool> UpdateAsync(Action<SessionData> mutate, CancellationToken ct = default)
    {
        if (!Ctx.Request.Cookies.TryGetValue(sessionOpts.Value.CookieName, out var sessionId)
            || string.IsNullOrWhiteSpace(sessionId))
            return false;

        var redisKey = redisOpts.Value.RedisPrefix + sessionId;
        var raw = await redis.GetStringAsync(redisKey, ct);
        if (raw is null) return false;

        var session = JsonSerializer.Deserialize<SessionData>(raw, _json)!;
        mutate(session);                                        // caller mutates in place

        await redis.SetStringAsync(redisKey,
            JsonSerializer.Serialize(session, _json), CacheOpts, ct);

        return true;
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    public async Task ClearAsync(CancellationToken ct = default)
    {
        if (Ctx.Request.Cookies.TryGetValue(sessionOpts.Value.CookieName, out var sessionId)
            && !string.IsNullOrWhiteSpace(sessionId))
        {
            await redis.RemoveAsync(redisOpts.Value.RedisPrefix + sessionId, ct);
            logger.LogInformation("Session removed from Redis.");
        }

        Ctx.Response.Cookies.Append(sessionOpts.Value.CookieName, string.Empty, new CookieOptions
        {
            HttpOnly = true,
            Secure = UseSecureCookies,
            SameSite = SameSiteMode.Strict,
            MaxAge = TimeSpan.Zero,
            Path = "/"
        });
    }

    /// <summary>Reads request cookie; throws 401 if none exists (SECURE endpoints).</summary>
    public string GetSessionIdAsync(CancellationToken ct = default)
    {
        if (!Ctx.Request.Cookies.TryGetValue(sessionOpts.Value.CookieName, out var sessionId)
    || string.IsNullOrWhiteSpace(sessionId))
        {
            logger.LogDebug("No session cookie present.");
            throw new UnauthorizedException("No active session. Unauthorized error.");
        }
        return sessionId;
    }

    public async Task<bool> HasTokenAsync(CancellationToken ct = default)
    {
        var session = await GetAsync(ct);
        return session is not null && !string.IsNullOrWhiteSpace(session.Token);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private HttpContext Ctx =>
        accessor.HttpContext ?? throw new InvalidOperationException("No active HTTP context.");

    private bool UseSecureCookies =>
        sessionOpts.Value.CookieSecure ?? !environment.IsDevelopment();

    /// <summary>
    /// 256-bit cryptographically secure random session ID.
    /// URL-safe Base64 — safe for cookies without encoding.
    /// </summary>
    private static string GenerateSessionId() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
               .Replace('+', '-').Replace('/', '_').TrimEnd('=');
}
