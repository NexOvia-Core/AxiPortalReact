using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;

namespace AxiPortal.BFF.Services.Interfaces;

public interface IPackageService
{
    Task<InstallPackageResponse> InstallPackageAsync(InstallPackageRequest req, CancellationToken ct);
    Task<PackageStatusResponse> CheckPackageStatusAsync(PackageStatusRequest req, CancellationToken ct);
    Task<GetRedirectUrlResult> GetRedirectUrlAsync(CancellationToken ct);
    Task<PackageProgressResponse> GetInstallProgressAsync(PackageProgressRequest req, CancellationToken ct);
    Task<InstallPackagesResponse> InstallPackagesAsync(InstallPackagesRequest req, CancellationToken ct);
}