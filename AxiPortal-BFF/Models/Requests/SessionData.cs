namespace AxiPortal.BFF.Models.Requests;
public sealed class SessionData
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AxiAccId { get; set; } = string.Empty;
    public string IsPrimary { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string SsoId { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string Error { get; set; } = string.Empty;
    //public DateTimeOffset CreatedAtUtc { get; set; }
}
