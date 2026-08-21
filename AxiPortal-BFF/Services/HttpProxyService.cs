using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AxiPortal.BFF.Exceptions;

namespace AxiPortal.BFF.Services;

/// <summary>
/// Thin HTTP proxy helper.
/// All upstream calls go through here so retry, error mapping,
/// and logging are applied consistently in one place.
/// </summary>
public sealed class HttpProxyService(IHttpClientFactory factory, ILogger<HttpProxyService> logger)
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// POST JSON to an upstream service.
    /// Throws <see cref="UpstreamApiException"/> on non-2xx responses.
    /// </summary>
    public async Task<JsonElement> PostJsonAsync(
        string clientName,
        string path,
        object body,
        string? bearerToken = null,
        CancellationToken ct = default)
    {
        var client  = factory.CreateClient(clientName);
        var payload = JsonSerializer.Serialize(body, JsonOpts);
        var content = new StringContent(payload, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = content
        };

        if (!string.IsNullOrWhiteSpace(bearerToken))
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

        logger.LogDebug("→ {Client} POST {Path}", clientName, path);

        HttpResponseMessage response;
        try
        {
            response = await client.SendAsync(request, ct);
        }
        catch (TaskCanceledException ex) when (!ct.IsCancellationRequested)
        {
            throw new UpstreamApiException($"Request to {clientName}/{path} timed out.", 504, ex.Message);
        }
        catch (HttpRequestException ex)
        {
            throw new UpstreamApiException($"Network error calling {clientName}/{path}.", 502, ex.Message);
        }

        var raw = await response.Content.ReadAsStringAsync(ct);

        logger.LogDebug("← {Client} {Status} ({Length} bytes)", clientName,
            (int)response.StatusCode, raw.Length);

        if (!response.IsSuccessStatusCode)
            throw new UpstreamApiException(
                $"Upstream {clientName} returned HTTP {(int)response.StatusCode}.",
                (int)response.StatusCode,
                raw);

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(raw, JsonOpts);
        }
        catch
        {
            throw new UpstreamApiException(
                $"Upstream {clientName} returned non-JSON response.", 502, raw);
        }
    }
}
