using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AxiPortal.BFF.Controllers;

/// <summary>
/// BFF Package endpoints — package installation operations.
///
/// ENDPOINT MAP:
///   POST /api/auth/check-send-otp   → email validation + OTP dispatch (credential flow)
/// </summary>
[ApiController]
[Route("api/package")]
[Produces("application/json")]

public sealed class PackageController(IPackageService packageService, ILogger<PackageController> logger): ControllerBase
{
    // POST /api/package/check-status
    // Checks the package status in redis
    [HttpPost("check-status")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CheckPackageStatus(
        [FromBody] PackageStatusRequest req, CancellationToken ct)
    {
        logger.LogInformation("Processing package {PackageName} for {SchemaName}", req.PackageName, req.SchemaName);

        var result = await packageService.CheckPackageStatusAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Message ?? "Failed.", "PACKAGE_ERROR"));

        return Ok(ApiResponse<object>.Ok(result));
    }
    // POST /api/package/install
    // Installs the package
    [HttpPost("install")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> InstallPackage(
        [FromBody] InstallPackageRequest req, CancellationToken ct)
    {
        logger.LogInformation("Processing package {PackageName} for {SchemaName}", req.PackageName, req.SchemaName);

        var result = await packageService.InstallPackageAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Message ?? "Failed.", "PACKAGE_ERROR"));

        return Ok(ApiResponse<object>.Ok(result));
    }

    [HttpPost("get-redirecturl")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> GetRedirectUrl(CancellationToken ct)
    {
        //logger.LogInformation("Processing package {PackageName} for {SchemaName}", req.PackageName, req.SchemaName);

        var result = await packageService.GetRedirectUrlAsync(ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Error ?? "Failed.", "SESSION_ERROR"));

        return Ok(ApiResponse<object>.Ok(result));
    }

    [HttpPost("install-bulk")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> InstallBulkPackages([FromBody] InstallPackagesRequest req, CancellationToken ct)
    {
        //logger.LogInformation("Processing package {PackageName} for {SchemaName}", req.PackageName, req.SchemaName);

        var result = await packageService.InstallPackagesAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail("Packages installation failed.", "PACKAGES_ERROR"));

        return Ok(ApiResponse<object>.Ok(result));
    }

    [HttpPost("progress")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> GetPkgInstallProgress([FromBody] PackageProgressRequest req, CancellationToken ct)
    {
        //logger.LogInformation("Processing package {PackageName} for {SchemaName}", req.PackageName, req.SchemaName);

        var result = await packageService.GetInstallProgressAsync(req, ct);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail("Failed.", "SESSION_ERROR"));

        return Ok(ApiResponse<object>.Ok(result));
    }
}
