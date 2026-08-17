using AxiPortal.BFF.Models.Requests;

namespace AxiPortal.BFF.Services.Interfaces;

/// <summary>
/// Abstracts token storage.
/// Backed by Redis: sessionId lives in the client cookie (HttpOnly),
/// the JWT lives in Redis keyed by sessionId – never exposed to the browser.
/// </summary>
public interface ITokenStore
{
    /// <summary>
    /// Generates a cryptographic sessionId, stores the JWT in Redis under that key,
    /// and writes the sessionId into the response cookie.
    /// </summary>
    Task SetAsync(SessionData session, CancellationToken ct = default);

    /// <summary>
    /// Reads sessionId from the request cookie, looks up the JWT in Redis.
    /// Returns null if cookie is missing or session has expired.
    /// </summary>
    Task<SessionData?> GetAsync(CancellationToken ct = default, string sessionId = "");

    Task<bool> UpdateAsync(Action<SessionData> mutate, CancellationToken ct = default);

    /// <summary>
    /// Removes the JWT from Redis and clears the session cookie.
    /// </summary>
    Task ClearAsync(CancellationToken ct = default);

    string GetSessionIdAsync(CancellationToken ct = default);


    Task<bool> HasTokenAsync(CancellationToken ct = default);
}