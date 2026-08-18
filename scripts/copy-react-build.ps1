param(
    [string]$Source = (Join-Path $PSScriptRoot "..\Axi_3d_Website\dist\public"),
    [string]$Destination = (Join-Path $PSScriptRoot "..\AxiPortal 3\bin\Release\net8.0\publish\wwwroot")
)

$resolvedSource = Resolve-Path -LiteralPath $Source -ErrorAction Stop

if (-not (Test-Path -LiteralPath (Join-Path $resolvedSource "index.html"))) {
    throw "React build output is missing index.html. Run 'pnpm build' in Axi_3d_Website first."
}

New-Item -ItemType Directory -Path $Destination -Force | Out-Null
Copy-Item -Path (Join-Path $resolvedSource "*") -Destination $Destination -Recurse -Force

Write-Host "Copied React build from '$resolvedSource' to '$Destination'."
