using AspNetCoreRateLimit;
using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Middleware;
using AxiPortal.BFF.Services;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Extensions.Http;
using Serilog;
using System.Net.Http.Headers;
using CorsOptions = AxiPortal.BFF.Configuration.CorsOptions;

namespace AxiPortal.BFF.Extensions;

public static class ServiceCollectionExtensions
{
    // ── Configuration ─────────────────────────────────────────────────────────
    public static IServiceCollection AddAxiConfiguration(
        this IServiceCollection services, IConfiguration config)
    {
        services.Configure<AxiOptions>(config.GetSection(AxiOptions.Section));
        services.Configure<OAuthOptions>(config.GetSection(OAuthOptions.Section));
        services.Configure<CorsOptions>(config.GetSection(CorsOptions.Section));
        services.Configure<SessionConfig>(config.GetSection(SessionConfig.Section));
        services.Configure<SwaggerConfig>(config.GetSection(SwaggerConfig.Section));
        services.Configure<RedisConfig>(config.GetSection(RedisConfig.Section));
        services.AddOptions<AxiOptions>()
            .Bind(config.GetSection(AxiOptions.Section))
            .ValidateDataAnnotations()   // uses [Required], [Range] etc. on the class
            .ValidateOnStart();          // crashes on startup, not first use
        services.AddOptions<RedisConfig>()
            .Bind(config.GetSection(RedisConfig.Section))
            .ValidateDataAnnotations() 
            .ValidateOnStart();
        return services;
    }

    // ── HTTP Clients with Polly retry ─────────────────────────────────────────
    public static IServiceCollection AddAxiHttpClients(
        this IServiceCollection services, IConfiguration config)
    {
        var axiOpts = config.GetSection(AxiOptions.Section).Get<AxiOptions>()!;
        var timeout = TimeSpan.FromSeconds(axiOpts.HttpTimeoutSecs);

        var retryPolicy = GetRetryPolicy(axiOpts.RetryCount);

        var circuitBreaker = GetCircuitBreakerPolicy();

        services.AddHttpClient("AxiClient", client =>
        {
            client.BaseAddress = new Uri(axiOpts.AxiClientApiUrl.TrimEnd('/') + "/");
            client.Timeout = timeout;
            client.DefaultRequestHeaders.Accept
                  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        })
        .AddPolicyHandler(retryPolicy)
        .AddPolicyHandler(circuitBreaker);

        services.AddHttpClient("ArmApi", client =>
        {
            client.BaseAddress = new Uri(axiOpts.ArmUrl.TrimEnd('/') + "/");
            client.Timeout = timeout;
            client.DefaultRequestHeaders.Accept
                  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        })
        .AddPolicyHandler(retryPolicy)
        .AddPolicyHandler(circuitBreaker);

        // ── OAuth provider HTTP clients ───────────────────────────────────────────
        // Well-known base URLs; only Supabase is configured.
        services.AddHttpClient("GoogleApis", client =>
        {
            client.BaseAddress = new Uri("https://www.googleapis.com/");
            client.Timeout     = TimeSpan.FromSeconds(10);
        });

        services.AddHttpClient("MicrosoftGraph", client =>
        {
            client.BaseAddress = new Uri("https://graph.microsoft.com/");
            client.Timeout     = TimeSpan.FromSeconds(10);
        });

        var oauthOpts = config.GetSection(OAuthOptions.Section).Get<OAuthOptions>();
        if (!string.IsNullOrWhiteSpace(oauthOpts?.Supabase?.Url))
        {
            services.AddHttpClient("Supabase", client =>
            {
                client.BaseAddress = new Uri(oauthOpts.Supabase.Url.TrimEnd('/') + "/");
                client.Timeout     = TimeSpan.FromSeconds(10);
            });
        }

        return services;
    }

    // ServiceCollectionExtensions.cs — extract to a static helper:
    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy(int retryCount) =>
        HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(retryCount,
                attempt => TimeSpan.FromMilliseconds(200 * Math.Pow(2, attempt)),
                onRetry: (outcome, delay, attempt, _) =>
                    Log.Warning("Retry {Attempt} after {Delay}ms: {Reason}",
                        attempt, delay.TotalMilliseconds, outcome.Exception?.Message));

    private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy() =>
        HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30),
                onBreak: (_, _) => Log.Warning("Circuit breaker OPEN"),
                onReset: () => Log.Information("Circuit breaker RESET"));

    // ── Session ───────────────────────────────────────────────────────────────
    public static IServiceCollection AddAxiSession(
        this IServiceCollection services, IConfiguration config)
    {
        var sessionCfg = config.GetSection(SessionConfig.Section).Get<SessionConfig>()
                      ?? new SessionConfig();
        var redisCfg = config.GetSection(RedisConfig.Section).Get<RedisConfig>()
                      ?? new RedisConfig();

        // Redis is REQUIRED for token storage.
        // In development you can use a local Redis (docker run -p 6379:6379 redis:alpine).
        // Fall back to in-memory only for local dev when no Redis is configured.
        if (redisCfg.IsEnabled)
        {
            services.AddStackExchangeRedisCache(o =>
                o.Configuration = redisCfg.GetConnectionString);
        }
        else
        {
            // In-memory fallback for local dev (single-instance only – not for production)
            services.AddDistributedMemoryCache();
        }

        return services;
    }

    // ── CORS ──────────────────────────────────────────────────────────────────
    public static IServiceCollection AddAxiCors(
        this IServiceCollection services, IConfiguration config, IHostEnvironment env)
    {
        var origins = config.GetSection(CorsOptions.Section)
                            .Get<CorsOptions>()?.AllowedOrigins ?? [];

        services.AddCors(o => o.AddPolicy("AxiPortalPolicy", p =>
        {
            if (origins.Length == 0)
            {
                if (env.IsDevelopment())  // needs env injected
                    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                else
                    throw new InvalidOperationException("CORS: AllowedOrigins must be configured in production.");
            }
        }));

        return services;
    }

    // ── Rate Limiting ─────────────────────────────────────────────────────────
    public static IServiceCollection AddAxiRateLimiting(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddMemoryCache();
        services.Configure<IpRateLimitOptions>(config.GetSection("RateLimit"));
        services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
        services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
        services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
        services.AddInMemoryRateLimiting();
        return services;
    }

    // ── Application Services ──────────────────────────────────────────────────
    public static IServiceCollection AddAxiServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ITokenStore, RedisTokenStore>();   // sessionId cookie ↔ Redis JWT
        services.AddScoped<HttpProxyService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IOAuthService, OAuthService>();
        services.AddScoped<IPackageService, PackageService>();
        return services;
    }

    // ── Swagger (dev only) ────────────────────────────────────────────────────
    public static IServiceCollection AddAxiSwagger(
    this IServiceCollection services, IConfiguration config)
    {
        var enabled = config.GetSection(SwaggerConfig.Section)
                            .Get<SwaggerConfig>()?.Enabled ?? false;
        if (!enabled) return services;

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new()
            {
                Title = "AxiPortal BFF API",
                Version = "v1",
                Description = "Backend-for-Frontend proxy layer. Secrets never reach the client."
            });
        });
        return services;
    }
}

// ── WebApplication pipeline extensions ────────────────────────────────────────
public static class WebApplicationExtensions
{
    public static WebApplication UseAxiMiddleware(this WebApplication app)
    {
        app.UseMiddleware<GlobalExceptionMiddleware>();
        app.UseMiddleware<RequestLoggingMiddleware>();
        return app;
    }

    public static WebApplication UseAxiSwagger(this WebApplication app)
    {
        var swaggerEnabled = app.Configuration
            .GetSection(SwaggerConfig.Section).Get<SwaggerConfig>()?.Enabled ?? false;

        if (swaggerEnabled)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "AxiPortal BFF v1");
                c.RoutePrefix = "swagger";
            });
        }
        return app;
    }
}