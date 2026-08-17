using System.ComponentModel.DataAnnotations;

namespace AxiPortal.BFF.Configuration;

/// <summary>
/// Strongly-typed config for AxiPortal BFF.
/// ARM layer removed — all calls go to AxiClient directly.
///
/// Production secrets via environment variables (double-underscore separator):
///   Axi__ClientApiBaseUrl=https://...
///   Axi__SharedDatabase=axpertdb
/// </summary>
public sealed class AxiOptions
{
    public const string Section = "Axi";

    [Required, Url] public string AxiClientApiUrl { get; init; } = string.Empty;
    [Required] public string SharedDatabase { get; init; } = string.Empty;
    [Required] public string AxiControlSchemaName { get; init; } = string.Empty;
    public int HttpTimeoutSecs { get; init; } = 30;
    public int RetryCount { get; init; } = 3;
    [Required, Url] public string ArmUrl { get; init; } = string.Empty;
    [Required, Url] public string AppLoginUrl { get; init; } = string.Empty;
    [Required, Url] public string AppWebDomain { get; init; } = string.Empty;
}