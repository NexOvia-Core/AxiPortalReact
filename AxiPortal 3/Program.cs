using AspNetCoreRateLimit;
using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Extensions;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Events;

// ── Bootstrap Serilog before anything else (captures startup errors) ──────────
// Load configuration first to get logging settings
var bootstrapConfig = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("axiglobalconfig.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

var logSettings = bootstrapConfig.GetSection("Logging").Get<LogOptions>() ?? new LogOptions();

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Is(logSettings.EnableDebug ? LogEventLevel.Debug : LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    //.Enrich.WithMachineName()
    //.Enrich.WithEnvironmentName()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: Path.Combine(logSettings.LogDirectory, $"{logSettings.LogFilePrefix ?? "axiportal"}-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: logSettings.RetainedFileCount,
        fileSizeLimitBytes: (long)logSettings.FileSizeLimitMB * 1024 * 1024,
        rollOnFileSizeLimit: true,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Configuration.Sources.Clear();
    builder.Configuration
        .SetBasePath(AppContext.BaseDirectory)
        .AddJsonFile("axiglobalconfig.json", optional: false, reloadOnChange: true)
        .AddEnvironmentVariables();

    // ── Serilog (reads from appsettings) ──────────────────────────────────────
    //builder.Host.UseSerilog((ctx, services, cfg) =>
    //    cfg.ReadFrom.Configuration(ctx.Configuration)
    //       .ReadFrom.Services(services)
    //       .Enrich.FromLogContext()
    //       .Enrich.WithProperty("Application", "AxiPortal.BFF")
    //       .Enrich.WithProperty("Environment", builder.Environment.EnvironmentName)
    //);
    builder.Host.UseSerilog();

    // ── Configuration ─────────────────────────────────────────────────────────
    builder.Services.AddAxiConfiguration(builder.Configuration);

    // ── Controllers ───────────────────────────────────────────────────────────
    builder.Services.AddControllers();

    // ── Health Checks (for container orchestration) ──────────────────────────
    //builder.Services.AddHealthChecks()
    //    .AddRedisCheck(builder.Configuration.GetSection("Redis")["ConnectionString"],
    //        name: "redis", tags: new[] { "ready", "live" })
    //    .AddUrlGroup(new Uri(builder.Configuration["AxiClientAPI"] ?? "http://localhost:5000"),
    //        name: "axi-client-api", tags: new[] { "ready" });

    // ── Features ──────────────────────────────────────────────────────────────
    builder.Services
        .AddAxiHttpClients(builder.Configuration)
        .AddAxiSession(builder.Configuration)
        .AddAxiCors(builder.Configuration, builder.Environment)
        .AddAxiRateLimiting(builder.Configuration)
        .AddAxiServices()
        .AddAxiSwagger(builder.Configuration);

    builder.Services.Configure<AxpertWebRedisConfig>(builder.Configuration.GetSection("AxpertWebRedis"));
    // ── Build ─────────────────────────────────────────────────────────────────
    var app = builder.Build();

    // ── Middleware pipeline (ORDER MATTERS) ───────────────────────────────────

    // 1. Exception handler – must be first so all errors are caught
    app.UseAxiMiddleware();

    // 2. HTTPS redirect
    if (!app.Environment.IsDevelopment())
        app.UseHsts();
    app.UseHttpsRedirection();

    app.Use(async (context, next) =>
    {
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
        context.Response.Headers.Append("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
        await next();
    });

    // Production hosts the portal below /axiportal while the BFF routes remain /api/*.
    // app.UsePathBase("/axiportal");

    // 3. Serve your portal HTML/CSS/JS from wwwroot
    //    index.html, auth.js, styles.css, etc. → just drop them here
    app.UseDefaultFiles();       // maps "/" → "/index.html"
    app.UseStaticFiles();        // serves everything in wwwroot/

    // 4. Health checks endpoint
    //app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    //{
    //    Predicate = check => check.Tags.Contains("ready")
    //});
    //app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    //{
    //    Predicate = _ => false // Just check if the app is running
    //});

    // 4. Rate limiting
    app.UseIpRateLimiting();

    // 5. CORS
    app.UseCors("AxiPortalPolicy");

    // 6. Session
    //app.UseSession();

    // 7. Routing + Controllers
    app.MapControllers();

    // 8. SPA fallback:
    //    Any route that doesn't match /api/* → serve index.html
    //    This lets your frontend handle its own client-side routes
    app.MapFallback(async context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
    });

    // 9. Swagger (dev only)
    app.UseAxiSwagger();

    Log.Information("AxiPortal BFF started in {Environment} mode.", app.Environment.EnvironmentName);

    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "AxiPortal BFF failed to start.");
    return 1;
}
finally
{
    await Log.CloseAndFlushAsync();
}

return 0;
