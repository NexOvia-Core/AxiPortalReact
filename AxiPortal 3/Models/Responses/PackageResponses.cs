namespace AxiPortal.BFF.Models.Responses;

public sealed record InstallPackagesResponse(
   bool Success, 
   List<InstallPackageResult> Results
);

public sealed record InstallPackageResult(
    string PackageName, 
    bool Success, 
    string Message
);

public sealed record PackageProgressResponse ( bool Success, List<PackageProgressItem> Statuses ); 

public sealed record PackageProgressItem
( string PackageName, string Status );


public sealed record PackageStatusResponse(
    bool Success,
    string Status,
    string Message
);

public sealed record InstallPackageResponse(
    bool Success,
    string Message
);