namespace AxiPortal.BFF.Exceptions;

/// <summary>Base for all BFF domain errors.</summary>
public abstract class BffException : Exception
{
    public int    StatusCode { get; }
    public string ErrorCode  { get; }

    protected BffException(string message, int statusCode, string errorCode)
        : base(message)
    {
        StatusCode = statusCode;
        ErrorCode  = errorCode;
    }
}

/// <summary>Upstream API returned an error (4xx / 5xx).</summary>
public sealed class UpstreamApiException : BffException
{
    public string? UpstreamBody { get; }

    public UpstreamApiException(string message, int upstreamStatus, string? body = null)
        : base(message, upstreamStatus >= 500 ? 502 : upstreamStatus, "UPSTREAM_ERROR")
        => UpstreamBody = body;
}

/// <summary>Required configuration is missing or invalid.</summary>
public sealed class ConfigurationException : BffException
{
    public ConfigurationException(string message)
        : base(message, 500, "CONFIG_ERROR") { }
}

/// <summary>Request validation failed.</summary>
public sealed class ValidationException : BffException
{
    public ValidationException(string message = "Validation failed")
        : base(message, 400, "VALIDATION_ERROR") { }
}
//public sealed class ValidationException : BffException
//{
//    public IReadOnlyDictionary<string, string[]> Errors { get; }

//    public ValidationException(IReadOnlyDictionary<string, string[]> errors)
//        : base("Validation failed.", 400, "VALIDATION_ERROR")
//        => Errors = errors;

//    public ValidationException(string field, string message)
//        : base("Validation failed.", 400, "VALIDATION_ERROR")
//        => Errors = new Dictionary<string, string[]> { [field] = [message] };
//}

/// <summary>Session does not carry a valid token; user must re-authenticate.</summary>
public sealed class UnauthorizedException : BffException
{
    public UnauthorizedException(string message = "Session expired. Please log in again.")
        : base(message, 401, "UNAUTHORIZED") { }
}
