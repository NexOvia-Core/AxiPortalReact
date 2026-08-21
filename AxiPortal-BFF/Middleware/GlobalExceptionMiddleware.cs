using System.Text.Json;
using AxiPortal.BFF.Exceptions;
using AxiPortal.BFF.Models.Responses;

namespace AxiPortal.BFF.Middleware;

/// <summary>
/// Catches all unhandled exceptions and returns a consistent ApiResponse envelope.
/// Keeps internal stack traces off the wire in production.
/// </summary>
public sealed class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger,
    IWebHostEnvironment env)
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await next(ctx);
        }
        catch (Exception ex)
        {
            await HandleAsync(ctx, ex);
        }
    }

    private async Task HandleAsync(HttpContext ctx, Exception ex)
    {
        var (statusCode, errorCode, message, errors) = ex switch
        {
            ValidationException             v => (v.StatusCode, v.ErrorCode, v.Message, (object)new {}),
            UnauthorizedException           u => (u.StatusCode, u.ErrorCode, u.Message, (object)new {}),
            UpstreamApiException            a => (a.StatusCode, a.ErrorCode, a.Message, (object)new {}),
            ConfigurationException          c => (c.StatusCode, c.ErrorCode, c.Message, (object)new {}),
            BffException                    b => (b.StatusCode, b.ErrorCode, b.Message, (object)new {}),
            _                               => (500, "INTERNAL_ERROR", "An unexpected error occurred.", (object)new {})
        };

        // Log with full details server-side; client only gets the safe message
        if (statusCode >= 500)
            logger.LogError(ex, "Unhandled exception: {ErrorCode} {Message}", errorCode, ex.Message);
        else
            logger.LogWarning("Handled exception: {ErrorCode} {Message}", errorCode, ex.Message);

        var body = new ApiResponse<object>
        {
            Success   = false,
            ErrorCode = errorCode,
            Message   = message,
            Data      = errors,
            // Only include stack trace in Development
            Debug     = env.IsDevelopment() ? ex.ToString() : null
        };

        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode  = statusCode;

        await ctx.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOpts));
    }
}
