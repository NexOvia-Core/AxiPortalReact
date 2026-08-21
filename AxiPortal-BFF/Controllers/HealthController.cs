using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Models.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AxiPortal.BFF.Controllers;

/// <summary>
/// Standard health check endpoints used by load balancers, Docker,
/// Azure App Service, and monitoring tools (UptimeRobot, Pingdom, etc.)
/// </summary>
[ApiController]
[Route("api/health")]
public sealed class HealthController(IOptions<AxiOptions> options) : ControllerBase
{
    // GET /api/health  – quick liveness probe (are we alive?)
    [HttpGet]
    public IActionResult Liveness() =>
        Ok(new { status = "healthy", timestamp = DateTime.UtcNow });

    // GET /api/health/ready  – readiness probe (is config sane?)
    [HttpGet("ready")]
    public IActionResult Readiness()
    {
        var opts     = options.Value;
        var clientOk = !string.IsNullOrWhiteSpace(opts.AxiClientApiUrl);
        var ready    = clientOk;

        return ready
            ? Ok(ApiResponse<object>.Ok(new { axiClient = clientOk }))
            : StatusCode(503, ApiResponse<object>.Fail("Service not ready – check configuration.", "NOT_READY"));
    }
}
