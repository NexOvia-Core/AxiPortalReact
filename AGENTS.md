# Repository Guidelines

## Project Structure & Module Organization

This workspace contains two applications:

- `AxiPortal 3/` is the .NET 8 backend-for-frontend (BFF). Entry points and configuration live in `Program.cs` and `Configuration/`; domain services are in `Services/` and contracts in `Services/Interfaces/`. Request/response DTOs are under `Models/`, while middleware and extensions are in their respective directories.
- `Axi_3d_Website/` is the Vite React/TypeScript site. Client code lives in `client/src/` (`pages/`, `components/`, `hooks/`, and `contexts/`); static media belongs in `client/public/`. The Express server is in `server/`. Treat `scratch/` as temporary research material, not production code.

## Build, Test, and Development Commands

Run commands from the relevant application directory.

- `cd Axi_3d_Website; pnpm install` installs website dependencies.
- `pnpm dev` starts the Vite development server; `pnpm build` creates the client and server production bundle.
- `pnpm check` runs TypeScript type checking. `pnpm format` applies Prettier formatting.
- `cd "AxiPortal 3"; dotnet restore` restores BFF packages.
- `dotnet run --project AxiPortal.BFF.csproj` runs the BFF locally. Use `dotnet build AxiPortal.BFF.sln` before submitting backend changes.

## Coding Style & Naming Conventions

Follow the existing style in edited files. Use TypeScript with 2-space indentation and Prettier for the website. Name React components and pages in PascalCase (`ContactModal.tsx`), hooks with `use` (`useMobile.tsx`), and helpers in camelCase. Keep reusable UI primitives in `client/src/components/ui/`.

For C#, use 4-space indentation, PascalCase for public types/members, camelCase for locals and parameters, and `I`-prefixed interfaces (for example, `ITokenStore`). Keep DTOs separated into `Models/Requests` and `Models/Responses`.

## Testing Guidelines

No automated test projects or package test script are currently configured. At minimum, run `pnpm check` and `pnpm build` for website changes, or `dotnet build` for BFF changes. Add focused tests alongside new behavior when introducing a test setup; name them after the behavior under test.

## Commit & Pull Request Guidelines

Recent website commits use short, descriptive subjects such as `Axi_changes` and `Axi 3d Website`. Prefer clearer imperative summaries, for example `Add contact form validation`. Keep commits scoped to one application or concern. Pull requests should describe the change, list validation performed, link related work, and include screenshots for visible website changes. Do not commit credentials; keep environment-specific values in local configuration.

## Agent skills

### Issue tracker

GitHub Issues in `NexOvia-Core/AxiPortalReact`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical triage labels are in use. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context domain documentation is used. See `docs/agents/domain.md`.
