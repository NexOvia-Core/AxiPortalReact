# Axi Portal

![Axi logo](Axi_3d_Website/client/public/AXI_LOGO_AXPERT.png)

Axi Portal is the account gateway for the Axi platform. It combines a React 19 website with an ASP.NET Core 8 backend-for-frontend (BFF). The portal supports account registration, login, SSO, schema selection, package installation, provisioning, keep-me-signed-in sessions, and redirect-based access to the main Axi application.

## Repository Layout

```text
AxiPortalReact/
├── Axi_3d_Website/       # React 19 + TypeScript + Vite 7 client
│   ├── client/src/       # Pages, components, hooks, contexts, API client
│   ├── client/public/    # Browser-served images and static media
│   └── server/           # Minimal production static-file server
├── AxiPortal 3/          # ASP.NET Core 8 BFF and legacy portal assets
│   ├── Controllers/      # /api/auth, /api/oauth, and /api/package endpoints
│   ├── Services/         # Upstream integrations, Redis sessions, provisioning
│   ├── Models/           # Request and response contracts
│   └── wwwroot/          # Legacy HTML/CSS/JavaScript reference implementation
└── docs/                 # Agent and domain documentation
```

The React client owns presentation and browser state. The BFF owns authentication tokens, OAuth validation, provisioning, Redis-backed package progress, and main-app redirect URLs. Keep credentials and environment-specific values in local configuration; do not commit them.

## Prerequisites

- Node.js 20+ and pnpm 10+
- .NET SDK 8+
- Access to the configured upstream Axi services and Redis instance
- A local `AxiPortal 3/axiglobalconfig.json` with valid environment settings

## Run Locally

Start the BFF and website in separate terminals:

```powershell
cd "AxiPortal 3"
dotnet restore
dotnet run --project AxiPortal.BFF.csproj
```

```powershell
cd Axi_3d_Website
pnpm install
pnpm dev
```

The Vite proxy uses `VITE_BFF_ORIGIN` when set; otherwise it targets `http://localhost/AxiPortalBFF`. For a different BFF host, create `Axi_3d_Website/.env.local`:

```env
VITE_BFF_ORIGIN=http://localhost/AxiPortalBFF
```

## Validate and Build

```powershell
cd Axi_3d_Website
pnpm check      # TypeScript validation
pnpm build      # Client bundle plus production server bundle
pnpm preview    # Preview the Vite output
pnpm start      # Serve dist/public with the production server
```

For BFF changes, run `dotnet build "AxiPortal 3/AxiPortal.BFF.sln"`.

## Portal Flow

Package selection is stored as one session-scoped selection from the landing page. Login verifies the email, presents available schemas inline, and then continues with password, OTP, or SSO. Successful primary login creates the BFF redirect session before package confirmation and React Query progress polling. Signup verifies email ownership, validates company details, starts provisioning, and exposes the time-limited direct-login path returned by the BFF.

The production deployment serves the generated React files from the BFF host. Keep the UI and API under the same origin where possible (`/axiportal/` and `/axiportal/api/*`); configure the reverse proxy/path base consistently with the target IIS deployment.
