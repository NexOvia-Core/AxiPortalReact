namespace AxiPortal.BFF.Configuration;

public sealed class LogOptions
{
    public bool EnableDebug { get; set; }
    public string LogDirectory { get; set; } = "Logs";
    public string LogFilePrefix { get; set; } = "axiportal";
    public int RetainedFileCount { get; set; } = 31;
    public int FileSizeLimitMB { get; set; } = 10;
}