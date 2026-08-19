using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Exceptions;
using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AxiPortal.BFF.Services;

public sealed class PackageService(
    IHttpClientFactory httpClientFactory,
    ITokenStore tokenStore,
    IOptions<AxiOptions> options, 
    IOptions<AxpertWebRedisConfig> axpertRedisOpts,
    ILogger<PackageService> logger) : IPackageService
{
    private readonly AxiOptions _opts = options.Value;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public async Task<PackageStatusResponse> CheckPackageStatusAsync(
        PackageStatusRequest req, CancellationToken ct)
    {
        var schema = req.SchemaName.ToUpperInvariant();
        var pkgName = req.PackageName.Replace(" ", "_");

        if (await RedisFlagExistsAsync(schema, "installedpkg", pkgName, ct))
            return new PackageStatusResponse(true, "ALREADY_INSTALLED",
                $"The {req.PackageName} package is already active on your account.");

        if (await RedisFlagExistsAsync(schema, "inprogresspkg", pkgName, ct))
            return new PackageStatusResponse(true, "IN_PROGRESS",
                $"The {req.PackageName} package is currently being installed. Please wait until the installation is complete before attempting any further actions.");


        return new PackageStatusResponse(true, "NEW", "");
    }
    public async Task<InstallPackageResponse> InstallPackageAsync(
        InstallPackageRequest req, CancellationToken ct)
    {
        var schemaName = req.SchemaName.ToUpperInvariant();
        var pkgName = req.PackageName.Replace(" ", "_");
        string keysToClear = $"{schemaName.ToLower()}~{_opts.AxiControlSchemaName}-General-*";

        await MarkInProgressAsync(schemaName, pkgName, ct);
        await PushInstallToQueueAsync(schemaName, req, ct);
        await RedisClearCacheAsync(keysToClear, ct);
        //await RedisDeleteKeyAsync(schemaName, keysToClear, ct);

        return new InstallPackageResponse(true, $"{req.PackageName} setup has started. We'll notify you once it is ready.");
    }

    public async Task<InstallPackagesResponse> InstallPackagesAsync(
        InstallPackagesRequest req, CancellationToken ct)
    {
        var schema = req.SchemaName.ToUpperInvariant();
        var results = new List<InstallPackageResult>();
        string keysToClear = $"{schema.ToLower()}~{_opts.AxiControlSchemaName}-General-*";

        // Sequential on purpose: keeps ARM queue push order deterministic and
        // avoids hammering the ARM API with a burst of parallel calls.
        foreach (var pkg in req.Packages)
        {
            var pkgName = pkg.PackageName.Replace(" ", "_");

            try
            {
                await MarkInProgressAsync(schema, pkgName, ct);
                await PushInstallToQueueAsync(schema, new InstallPackageRequest(
                    schema, pkg.PackageName, pkg.PackageVersion, req.RequestedBy), ct);
                results.Add(new InstallPackageResult(pkg.PackageName, true, ""));
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to queue install for {Schema}/{Package}", schema, pkg.PackageName);
                results.Add(new InstallPackageResult(pkg.PackageName, false, "Failed to initiate installation."));
            }
        }

        await RedisClearCacheAsync(keysToClear, ct);
        //await RedisDeleteKeyAsync(schema, keysToClear, ct);

        return new InstallPackagesResponse(true, results);
    }

    public async Task<PackageProgressResponse> GetInstallProgressAsync(
        PackageProgressRequest req, CancellationToken ct)
    {
        var schema = req.SchemaName.ToUpperInvariant();
        var statuses = new List<PackageProgressItem>();

        foreach (var packageName in req.PackageNames)
        {
            var pkgKey = packageName.Replace(" ", "_");
            var redisKey = $"{schema}_{req.Username}_{pkgKey}";

            var response = await RedisReadValueAsync(schema, redisKey, ct);

            string status = GetString(response, "result") ?? "QUEUED";
            var logUrl = status == "FAILED"
                ? await GetFailedPackageLogUrlAsync(schema, req.Username, pkgKey, ct)
                : null;
            statuses.Add(new PackageProgressItem(packageName, status, logUrl));

            // Terminal states are one-shot: clear so future polls/installs start clean.
            if (status is "INSTALLED" or "FAILED")
            {
                await RedisDeleteKeyAsync(schema, redisKey, ct);
                await RedisDeleteKeyAsync(schema, $"{schema}-inprogresspkg_{pkgKey}", ct);
            }
        }

        return new PackageProgressResponse(true, statuses);
    }

    public async Task<PackageLogDownload?> DownloadFailedPackageLogAsync(
        FailedPackageLogRequest req,
        CancellationToken ct)
    {
        await RequireSessionAsync(ct);

        var schema = req.SchemaName.ToUpperInvariant();
        var pkgKey = req.PackageName.Replace(" ", "_");
        var fileName = await GetFailedPackageLogFileNameAsync(schema, req.Username, pkgKey, ct);
        if (fileName is null || !Uri.TryCreate(_opts.ArmScriptUrl, UriKind.Absolute, out var scriptsBase))
            return null;

        var logDirectory = new Uri(scriptsBase.ToString().TrimEnd('/') + "/AxInstallerLogs/");
        var logUrl = new Uri(logDirectory, Uri.EscapeDataString(fileName));
        using var response = await httpClientFactory.CreateClient().GetAsync(logUrl, ct);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Failed to retrieve installation log for {Schema}/{Package}. HTTP {StatusCode}",
                schema,
                req.PackageName,
                response.StatusCode);
            return null;
        }

        return new PackageLogDownload(await response.Content.ReadAsByteArrayAsync(ct), fileName);
    }

    private async Task<bool> RedisFlagExistsAsync(string schema, string prefix, string pkgKey, CancellationToken ct)
    {
        var key = $"{schema}-{prefix}_{pkgKey}";
        var resp = await RedisReadValueAsync(schema, key, ct);
        return resp.TryGetProperty("success", out var s) && s.GetBoolean();
    }

    private async Task<string?> GetFailedPackageLogUrlAsync(
        string schema,
        string username,
        string pkgKey,
        CancellationToken ct)
    {
        var fileName = await GetFailedPackageLogFileNameAsync(schema, username, pkgKey, ct);
        if (fileName is null)
            return null;

        if (!Uri.TryCreate(_opts.ArmScriptUrl, UriKind.Absolute, out var scriptsBase))
        {
            logger.LogWarning("ArmScriptUrl is not configured; failed package log links are unavailable.");
            return null;
        }

        return $"api/package/installation-log?schemaName={Uri.EscapeDataString(schema)}&username={Uri.EscapeDataString(username)}&packageName={Uri.EscapeDataString(pkgKey)}";
    }

    private async Task<string?> GetFailedPackageLogFileNameAsync(
        string schema,
        string username,
        string pkgKey,
        CancellationToken ct)
    {
        var failedKey = $"{schema}_{username}_{pkgKey}_FAILED";
        var response = await RedisReadValueAsync(schema, failedKey, ct);
        var fileName = GetString(response, "value") ?? GetString(response, "result");

        return string.IsNullOrWhiteSpace(fileName) ||
               !string.Equals(fileName, Path.GetFileName(fileName), StringComparison.Ordinal)
            ? null
            : fileName;
    }

    /// <summary>
    /// Reads a raw Redis value via ARM's AxRedisRead. Returns null if the key
    /// doesn't exist or the call fails (treated as "not started yet" by callers).
    /// NOTE: assumes the ARM response exposes the value as "value" - confirm the
    /// actual field name against the AxRedisRead contract before shipping.
    /// </summary>
    private async Task<JsonElement> RedisReadValueAsync(string schema, string redisKey, CancellationToken ct)
    {
        var resp = await ArmClient().PostAsJsonAsync("AxUtils/api/v1/AxRedisRead", new
        {
            AccessCode = schema,
            InMemoryKey = redisKey,
            IsBinary = "false"
        }, JsonOpts, ct);

        if (!resp.IsSuccessStatusCode) return new JsonElement();
        var data = await resp.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        return data;
    }

    /// <summary>
    /// Deletes a Redis key once a package reaches a terminal state (Installed/Failed).
    /// NOTE: assumes an AxRedisDelete ARM endpoint exists with this shape - confirm
    /// against ARM_APIs before shipping; falls back to relying on the consumer's own
    /// key TTL if this call fails, so a missed delete is not user-visible.
    /// </summary>
    private async Task RedisDeleteKeyAsync(string schemaName, string redisKey, CancellationToken ct)
    {
        logger.LogInformation("Deleting Redis key: {Key}", redisKey);
        try
        {
            var result = await ArmClient().PostAsJsonAsync("AxUtils/api/v1/AxRedisDelete", new
            {
                AccessCode = schemaName,
                InMemoryKey = redisKey
            }, ct);

            var data = await result.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);

            if (!data.TryGetProperty("success", out var s) || !s.GetBoolean())
            {
                logger.LogInformation(GetString(data, "message") ?? "Failed to delete Redis key {Key} after terminal status", redisKey);
            }

            logger.LogInformation(GetString(data, "message") ?? "Deleted keys successfully.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to delete Redis key {Key} after terminal status", redisKey);
        }
    }

    private async Task RedisClearCacheAsync(string redisKey, CancellationToken ct)
    {
        var (db, server) = await GetAxpertRedisAsync();

        List<RedisKey> keys = new();

        foreach (RedisKey key in server.Keys(pattern: redisKey))
        {
            keys.Add(key);
            logger.LogInformation("Deleting Redis key: {Key}", key);
        }

        if (keys.Count > 0)
        {
            await db.KeyDeleteAsync(keys.ToArray());
            logger.LogInformation("Deleted {Count} Redis keys.", keys.Count);
        }
        else
        {
            logger.LogInformation("No Redis keys found for pattern {Pattern}", redisKey);
        }
    }

    private async Task PushInstallToQueueAsync(string schema, InstallPackageRequest req, CancellationToken ct)
    {
        var requestId = $"PKG-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000)}";
        var queueData = JsonSerializer.Serialize(new
        {
            requestId,
            appName = schema,
            packageName = req.PackageName,
            packageVersion = req.PackageVersion,
            requestedBy = req.RequestedBy,
            repository = "AxpertPackages"
        }, JsonOpts);

        var resp = await ArmClient().PostAsJsonAsync("ARM_APIs/api/v1/ARMPushToQueue", new
        {
            queuename = "axiinstallpackagesqueue",
            apiname = "axipackages",
            queuedata = queueData,
            timespandelay = "0"
        }, ct);

        if (!resp.IsSuccessStatusCode)
        {
            logger.LogWarning("ARMPushToQueue failed for {Schema}/{Package}", schema, req.PackageName);
            throw new UpstreamApiException("Failed to initiate package installation.", 502);
        }
    }

    private Task MarkInProgressAsync(string schema, string packageName, CancellationToken ct) =>
        ArmClient().PostAsJsonAsync("AxUtils/api/v1/AxRedisWrite", new
        {
            AccessCode = schema,
            InMemoryKey = $"{schema}-inprogresspkg_{packageName}",
            InMemoryValue = "",
            IsBinary = "false",
            KeyExpiryInMins = "720"
        }, ct);

    private HttpClient ArmClient()
    {
        var client = httpClientFactory.CreateClient("ArmApi");
        client.BaseAddress ??= new Uri(_opts.ArmUrl.TrimEnd('/') + "/");
        return client;
    }

    private async Task<SessionData> RequireSessionAsync(CancellationToken ct, string sessionId = "")
    {
        var session = await tokenStore.GetAsync(ct, sessionId);
        if (session is null || string.IsNullOrEmpty(session.Token))
            throw new UnauthorizedException("No active session. Please log in.");
        return session;
    }

    // ── AxpertWeb Redis helper ────────────────────────────────────────────────────
    /// <summary>
    /// Opens a short-lived connection to the AxpertWeb Redis instance.
    /// Caller disposes via `await using`.
    /// </summary>
    private async Task<(IDatabase db, IServer server)> GetAxpertRedisAsync()
    {
        var cfg = axpertRedisOpts.Value;
        var conn = await ConnectionMultiplexer.ConnectAsync(
            $"{cfg.Host}:{cfg.Port},password={cfg.Pwd}");
        var server = conn.GetServer(conn.GetEndPoints().First());
        return (conn.GetDatabase(), server);
    }

    private static string? GetString(JsonElement el, string key)
    => el.TryGetProperty(key, out var p) && p.ValueKind == JsonValueKind.String
        ? p.GetString() : null;

}
