namespace AxiPortal.BFF.Services.Interfaces;

/// <summary>
/// Handles fetching and caching of encrypted secrets from ARM.
/// Cached per raw-secret value (stable across app lifetime).
/// </summary>
public interface ISecretCacheService
{
    Task<string> GetEncryptedSecretAsync(string rawSecret, CancellationToken ct = default);
}
