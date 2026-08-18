using System.ComponentModel.DataAnnotations;

namespace AxiPortal.BFF.Configuration;

public sealed class CorsOptions
{
    public const string Section = "Cors";
    public string[] AllowedOrigins { get; init; } = [];
}

public sealed class SessionConfig
{
    public const string Section = "Session";
    public int    IdleTimeoutMinutes { get; init; } = 30;
    public string CookieName         { get; init; } = "__axi_sess";
    public bool?  CookieSecure       { get; init; }
}

public sealed class SwaggerConfig
{
    public const string Section = "Swagger";
    public bool Enabled { get; init; } = false;
}

public sealed class RedisConfig
{
    public const string Section = "Redis";
    [Required] public string Host { get; init; } = string.Empty;
    [Required] public string Port { get; init; } = string.Empty;
    public string Pwd { get; init; } = string.Empty;
    public string RedisPrefix { get; init; } = "axi:session:";
    public int IdleTimeoutMinutes { get; init; } = 0;
    public int AbsoluteTimeoutMinutes { get; init; } = 1;
    public bool   IsEnabled => !string.IsNullOrWhiteSpace(Host) && !string.IsNullOrWhiteSpace(Port);
    public string GetConnectionString =>
        string.IsNullOrWhiteSpace(Pwd)
            ? $"{Host}:{Port}"
            : $"{Host}:{Port},password={Pwd}";
}

public sealed class AxpertWebRedisConfig
{
    public string Host { get; init; } = string.Empty;
    public string Port { get; init; } = string.Empty;
    public string Pwd { get; init; } = string.Empty;
    public int AbsoluteTimeoutMinutes { get; init; } = 1;
}
