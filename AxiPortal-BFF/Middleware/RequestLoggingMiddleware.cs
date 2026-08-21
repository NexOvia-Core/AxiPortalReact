using System.Diagnostics;

namespace AxiPortal.BFF.Middleware;

/// <summary>
/// Logs every request with method, path, status code, and elapsed time.
/// Skips static file requests to avoid log noise.
/// </summary>
public sealed class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        var path = ctx.Request.Path.Value ?? string.Empty;

        // Skip static file noise (JS, CSS, images, favicon)
        if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
        {
            await next(ctx);
            return;
        }

        var sw = Stopwatch.StartNew();

        try
        {
            await next(ctx);
        }
        finally
        {
            sw.Stop();
            logger.LogInformation(
                "{Method} {Path} → {Status} in {ElapsedMs}ms",
                ctx.Request.Method,
                path,
                ctx.Response.StatusCode,
                sw.ElapsedMilliseconds);
        }
    }
}
