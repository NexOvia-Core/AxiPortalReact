using AxiPortal.BFF.Models.Responses;
using System.ComponentModel.DataAnnotations;

namespace AxiPortal.BFF.Models.Requests;

public sealed record PackageStatusRequest(
    [Required] string SchemaName,
    [Required] string PackageName
);
public sealed record InstallPackageRequest(
    [Required] string SchemaName,
    [Required] string PackageName,
    string PackageVersion,
    string RequestedBy
);

public sealed record InstallPackagesRequest ( string SchemaName, string RequestedBy, List<PackageItem> Packages );

public sealed record PackageItem ( string PackageName, string PackageVersion );

public sealed record PackageProgressRequest
( string SchemaName, string Username, List<string> PackageNames );

public sealed record FailedPackageLogRequest(
    [Required] string SchemaName,
    [Required] string Username,
    [Required] string PackageName
);
