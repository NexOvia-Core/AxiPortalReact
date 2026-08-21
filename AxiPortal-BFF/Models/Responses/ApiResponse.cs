namespace AxiPortal.BFF.Models.Responses;

/// <summary>
/// Consistent response envelope for every BFF endpoint.
/// The client always receives this shape – never a raw upstream response.
/// </summary>
public sealed class ApiResponse<T>
{
    public bool    Success   { get; init; }
    public string? Message   { get; init; }
    public string? ErrorCode { get; init; }
    public T?      Data      { get; init; }
    public string? Debug     { get; init; }   // only populated in Development

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<object> Fail(string message, string errorCode = "ERROR") =>
        new() { Success = false, Message = message, ErrorCode = errorCode };

}
