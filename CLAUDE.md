# CLAUDE.md

Context for Claude Code sessions in this repo. The README covers setup, the API and deployment; this file covers how to work here and what isn't obvious from the code.

## Project

Maaz's developer portfolio, live at https://ambitious-cliff-0d6dd630f.5.azurestaticapps.net (repo: github.com/maazsalim/portfolio).

- `web/`: Next.js 16 (App Router), static export, strict TypeScript, Tailwind v4.
- `api/`: C# Azure Functions, .NET 10 isolated worker, xUnit tests.
- Hosted on Azure Static Web Apps (Free plan) with managed Functions, deployed by `.github/workflows/azure-static-web-apps.yml`.

## Working with Maaz

- Explain things simply and concretely; Maaz is newer to Azure and Next.js. Keep code comments explaining *why*.
- Work in stages and pause for review after each. Commit only when asked.
- Commits use the repo-local identity `Maaz Salim <maazsalim@gmail.com>` (set in `.git/config`). Never commit with a work email.
- Maaz pushes; pushing to `main` deploys to production.

## Commands (from repo root)

| Command | Use |
|---|---|
| `npm run setup` | Install everything (root dev tools, web, .NET restore) |
| `npm run dev` | Site on :3000 with live reload + API on :7071 (Next proxies `/api` in dev) |
| `npm run preview` | Production build behind the SWA emulator on :4280, to test routes and headers |
| `npm run check` | Lint, typecheck, tests, both builds. Run before every commit |
| `npm run todo` | List remaining `TODO` placeholders in `web/content` and the README |

The first `npm run dev` takes ~30s while the API compiles.

## Conventions

- **All site copy lives in `web/content/*.ts`** (typed by `types.ts`). Components only render it. Placeholders contain the string `TODO`.
- A project's card uses the short fields; its `/projects/[slug]` page also uses `caseStudy`. Array order is display order.
- **Styling:** colours are CSS variables in `web/app/globals.css` exposed as Tailwind tokens (`bg-bg`, `text-fg-strong`, `text-accent`, `bg-card`, ...). Don't use Tailwind's `dark:` variant: it follows only the OS setting and ignores the theme toggle. Keep text contrast at WCAG AA in both themes.
- **Effects** (cursor glow, `spotlight-card`, `gradient-text`, `reveal`) are CSS-driven from `--x`/`--y`, set by `components/ui/PointerGlow.tsx`. Keep JS minimal and respect `prefers-reduced-motion`.
- **API:** functions stay thin; logic lives in services behind interfaces with DI and typed options; source-generated `[LoggerMessage]` logging; errors as `ProblemDetails`. `TreatWarningsAsErrors` is on in both projects.
- Read `web/AGENTS.md`: Next 16 differs from older versions, and its docs are in `web/node_modules/next/dist/docs/`.

## Decisions and gotchas (learned the hard way)

- **Static export only in production.** `web/next.config.ts` switches on the build phase: `output: "export"` for builds; a dev server with an `/api` → `:7071` rewrite in dev. `trailingSlash: true`, so `/api/x` redirects to `/api/x/` in dev only.
- **No client IP on SWA managed Functions.** Verified in production: the API only ever sees an Azure proxy (`CLIENT-IP`, `X-Forwarded-For` and the rest all carry the proxy). The contact rate limit is therefore **site-wide** (default 20/hour). Don't reintroduce per-IP limiting without a paid separately hosted Functions app.
- **SWA CLI schema lags Azure.** It rejects `apiRuntime: dotnet-isolated:10.0`, which Azure supports. `npm run preview` gives the emulator a copy of the config without `platform` (`scripts/swa-local-config.mjs`). The SWA CLI also hangs when it manages `func` itself on some networks, so the API is started separately.
- **`staticwebapp.config.json` lives in `web/public/`** so it's copied into `web/out`. The CSP is `'self'`-only: no external scripts, fonts or images, and no `upgrade-insecure-requests` (it breaks the HTTP local preview).
- **The Open Graph image is a static `web/app/opengraph-image.png`.** A generated, extensionless route was served as `application/octet-stream`. Regenerate it if the name or title changes.
- **The theme script uses `components/ui/InlineScript.tsx`** to avoid React's "script tag" dev warning.
- **Lighthouse:** test against a compressed server (e.g. `npx serve web/out`). Python's `http.server` doesn't compress, so it under-reports performance (~85 instead of 98+).
- Settings in `api/Portfolio.Api/local.settings.json` are local only (git-ignored). Production settings are SWA **Environment variables** in the Azure portal. With no `Resend__ApiKey` in Development, a log-only email sender is used.

## Deployment

- Push to `main` → the workflow lints, typechecks, tests, builds the site and publishes the API, then uploads pre-built output (`skip_app_build` / `skip_api_build`). PRs get preview environments.
- GitHub repo secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`.
- Azure environment variables: `GitHub__Username`, `GitHub__Token` (read-only, public repos, expires ~Oct 2027), `Resend__ApiKey`, `Resend__From`, `Resend__To`.
- Azure resources: resource group `portfolio-rg`, Static Web App `maaz-portfolio` (Free, East US 2), on a pay-as-you-go subscription.

## Status and next steps (as of 2026-10-08)

Done: stages 1–4 (scaffold, frontend, API + tests, SWA config + CI/CD), README, Spotlight design.

Remaining:
1. **Resend:** confirm the three `Resend__*` settings are in Azure, then send a test message through the live form.
2. **Azure budget alert** (e.g. email at $1) under Cost Management.
3. **Lighthouse on the live site** and record the scores in the README.
4. **Content TODOs** (`npm run todo`): ParkItPlace role, links, challenges and results; Face Detection repo link, challenges and results; portfolio Lighthouse result.
5. Optional: custom domain (buy one, add it under SWA → Custom domains, update `url` in `web/content/site.ts`).

Long-term: .NET 10 support ends Nov 2028, so upgrade `TargetFramework` and `apiRuntime` before then.
