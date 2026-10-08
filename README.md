# Muhammad Maaz Salim: Developer Portfolio

My personal portfolio: a statically exported **Next.js** site with a small **C# Azure Functions** API, deployed together on **Azure Static Web Apps**.

**Live site:** [ambitious-cliff-0d6dd630f.5.azurestaticapps.net](https://ambitious-cliff-0d6dd630f.5.azurestaticapps.net)

It is built to be fast and easy to skim for recruiters, and the repo is meant to show how I structure a real full-stack project: typed content, a tested API with services behind interfaces, and CI/CD.

## Highlights

- **Static front end:** Next.js (App Router) exported to plain HTML/CSS. No server rendering, about 1 KB of custom client JS for effects, and Lighthouse mobile scores of 98+ performance, 100 accessibility and 100 SEO on the compressed build.
- **C# API on managed Functions:** .NET 10 isolated worker with dependency injection, typed options, DTOs, server-side validation and source-generated structured logging.
- **Contact form:** validation, a honeypot field, a site-wide rate limit and email delivery through [Resend](https://resend.com). Errors use RFC 9457 problem details.
- **Live GitHub feed:** recently pushed repos, cached for an hour, with a last-known-good fallback if GitHub is unavailable.
- **xUnit tests** for validation, rate limiting, both services (HTTP mocked) and both functions.
- **Content as data:** projects, experience and skills live in typed files under [`web/content`](web/content), so editing copy never means touching components.
- **Accessible and responsive:** semantic landmarks, skip link, visible focus states, AA contrast in both themes, light/dark mode with no flash on load, and full support for reduced motion.

## Architecture

```mermaid
flowchart LR
    visitor([Visitor's browser])

    subgraph swa[Azure Static Web Apps]
        cdn[Global CDN<br/>static Next.js export]
        subgraph functions[Managed Functions · .NET 10 isolated]
            contact[POST /api/contact]
            github[GET /api/github]
        end
    end

    resend[(Resend<br/>email API)]
    ghapi[(GitHub<br/>REST API)]
    repo[GitHub repo] -- "push to main" --> actions[GitHub Actions] -- "build and deploy" --> swa

    visitor -- pages, CSS, JS --> cdn
    visitor -- fetch /api/* --> functions
    contact -- send email --> resend
    github -- repos, cached 1h --> ghapi
```

The site and API share one origin, so the browser calls `/api/...` directly with no CORS setup. Secrets such as the Resend key exist only as Azure app settings and never reach the browser or the repo.

## Repository layout

```
.
├── .github/workflows/           CI/CD: lint, test, build, deploy to Azure
├── web/                         Next.js front end (static export)
│   ├── app/                     Routes, layout, metadata, sitemap, OG image
│   │   └── projects/[slug]/     Case-study pages, generated from content
│   ├── components/
│   │   ├── sections/            Hero, Projects, Experience, Skills, About, Contact…
│   │   └── ui/                  Shared pieces: Section, TagList, ThemeToggle, icons…
│   ├── content/                 ← All site copy, as typed data
│   ├── lib/                     Typed API client, theme script
│   └── public/                  Resume PDF, staticwebapp.config.json, static assets
├── api/
│   ├── Portfolio.Api/           Azure Functions app
│   │   ├── Functions/           HTTP triggers (thin: parse → delegate → respond)
│   │   ├── Services/            Email, GitHub, rate limiting (behind interfaces)
│   │   ├── Validation/          Contact form rules
│   │   ├── Models/              Request/response DTOs
│   │   ├── Options/             Strongly typed settings
│   │   └── Http/                Client IP resolution
│   └── Portfolio.Api.Tests/     xUnit tests
├── scripts/                     Repo tooling (e.g. placeholder finder)
├── swa-cli.config.json          Local Azure emulator config
└── package.json                 One-command scripts for the whole repo
```

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org) 20 or newer
- [.NET SDK](https://dotnet.microsoft.com/download) 10

Azure Functions Core Tools and the Static Web Apps CLI are installed as project dev dependencies, so nothing needs installing globally.

### Setup

```bash
npm run setup
cp api/Portfolio.Api/local.settings.example.json api/Portfolio.Api/local.settings.json
```

`local.settings.json` is git-ignored. With `Resend__ApiKey` left empty, the API runs a log-only email sender in development: contact messages print to the terminal instead of being emailed.

### Start

```bash
npm run dev
```

Open **http://localhost:3000**. This starts the Next.js dev server (with live reload) and the Functions host on port 7071. In development, Next forwards `/api/*` to the Functions host. The first start takes about 30 seconds while the API compiles.

To check the **production build** exactly as Azure will serve it (routes, 404 page, security and cache headers from [`staticwebapp.config.json`](web/public/staticwebapp.config.json)), run `npm run preview` and open http://localhost:4280. This builds the static site and serves it through the Static Web Apps emulator, with no live reload.

### Scripts

| Command | What it does |
|---|---|
| `npm run setup` | Install all dependencies (root, web, .NET) |
| `npm run dev` | Site + API with live reload, on :3000 |
| `npm run preview` | Production build behind the SWA emulator, on :4280 |
| `npm run check` | Lint, typecheck, run tests, build everything. Run before pushing |
| `npm test` | API tests only |
| `npm run todo` | List placeholders that still need real content |

## Editing content

Everything visible on the site comes from [`web/content`](web/content):

| File | Controls |
|---|---|
| [`site.ts`](web/content/site.ts) | Name, title, pitch, About text, email, social links, site URL |
| [`projects.ts`](web/content/projects.ts) | Project cards **and** each `/projects/[slug]` case-study page |
| [`experience.ts`](web/content/experience.ts) | Experience timeline |
| [`skills.ts`](web/content/skills.ts) | Grouped skills |

[`types.ts`](web/content/types.ts) defines the shape of each, so TypeScript flags missing or misspelled fields.

The link-preview image is a static file, [`web/app/opengraph-image.png`](web/app/opengraph-image.png) (1200×630). Replace it if your name or title changes.

## API

### `POST /api/contact`

```json
{ "name": "Ada", "email": "ada@example.com", "message": "Hello!", "website": "" }
```

| Status | When |
|---|---|
| `202 Accepted` | Message sent (also returned when the `website` honeypot is filled, so bots learn nothing) |
| `400 Bad Request` | Invalid JSON, or validation errors as a `ValidationProblemDetails` with per-field messages |
| `429 Too Many Requests` | Over the site-wide rate limit; includes a `Retry-After` header |
| `502 Bad Gateway` | The email provider rejected or couldn't be reached |

Only valid submissions count toward the rate limit (default: 20 per hour across the whole site), so a visitor fixing a typo is never locked out. The limit is site-wide because Static Web Apps managed Functions only see an Azure proxy address, never the visitor's IP. I verified this on the deployed app, so per-IP limiting isn't possible on this plan. The cap keeps any spam burst inside the email provider's free quota.

### `GET /api/github`

Returns the most recently pushed public, non-fork, non-archived repos:

```json
{
  "profileUrl": "https://github.com/maazsalim",
  "repos": [
    { "name": "…", "description": "…", "url": "…", "language": "C#", "stars": 0, "pushedAt": "2026-10-01T00:00:00+00:00" }
  ]
}
```

Responses are cached in memory and via `Cache-Control` for one hour. If GitHub fails after the cache expires, the last good response is served. With nothing cached it returns `502`, and the front end falls back to a plain link to the GitHub profile.

### Configuration

Set these as application settings (Azure portal → Static Web App → **Environment variables**) or in `local.settings.json` locally:

| Setting | Required | Description |
|---|---|---|
| `Resend__ApiKey` | Yes (prod) | Resend API key |
| `Resend__From` | Yes (prod) | Sender, e.g. `Portfolio <onboarding@resend.dev>` |
| `Resend__To` | Yes (prod) | Where contact messages are delivered |
| `GitHub__Username` | Yes | GitHub account to show |
| `GitHub__Token` | No | Raises the GitHub rate limit from 60 to 5,000 requests per hour |
| `ContactRateLimit__PermitLimit` | No | Messages allowed site-wide per window (default `20`) |
| `ContactRateLimit__Window` | No | Window length as a `TimeSpan` (default `01:00:00`) |

## Deployment

The site deploys to **Azure Static Web Apps (Free plan)** through [GitHub Actions](.github/workflows/azure-static-web-apps.yml):

- **Push to `main`:** lint, typecheck, test, build, then deploy to production.
- **Pull request:** the same checks, then a temporary preview environment whose URL is posted on the PR. It's deleted when the PR closes.

The workflow builds the site and API itself and uploads only the finished output (`skip_app_build` / `skip_api_build`), so tool versions are pinned and a failing test blocks the deploy.

### One-time setup

1. In the Azure portal, create a **Static Web App**: plan **Free**, deployment source **Other**. The workflow in this repo is used instead of a generated one.
2. In the new resource, open **Overview → Manage deployment token** and copy the token.
3. In GitHub, go to **Settings → Secrets and variables → Actions** and add a repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN` with that token.
4. In Azure, under **Settings → Environment variables**, add the API settings from [Configuration](#configuration).
5. Set `url` in [`web/content/site.ts`](web/content/site.ts) to the production address so canonical URLs, the sitemap and Open Graph tags are correct.

The Free plan includes the managed Functions API and costs nothing.

### Hosting config

[`web/public/staticwebapp.config.json`](web/public/staticwebapp.config.json) is copied into the build output and sets:

- the API runtime (`dotnet-isolated:10.0`)
- the custom 404 page
- long-lived caching for hashed build assets
- security headers: Content-Security-Policy, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy

The SWA CLI's bundled schema doesn't list .NET 10 yet, so `npm run preview` hands the emulator a copy without the `platform` section (see [`scripts/swa-local-config.mjs`](scripts/swa-local-config.mjs)).

## Design notes and trade-offs

- **The contact rate limit is site-wide and in memory.** Managed Functions on Static Web Apps never see the visitor's IP, only an Azure proxy (verified in production), so a per-visitor limit isn't possible without a separately hosted Functions app on a paid plan. A site-wide cap still bounds spam and protects the email quota. Each Functions instance keeps its own counter, which resets when the instance recycles. That's fine at portfolio traffic; strict limits would need a shared store such as Redis or Table Storage.
- **Static export over server rendering.** Content changes only on deploy, so pre-rendered HTML is faster, cheaper and simpler. The two dynamic features (contact, GitHub feed) run through the API.
- **Effects are CSS-first.** The cursor glow and card highlights run on two CSS variables updated once per frame. Scroll reveals use CSS scroll-driven animations. All motion is off for `prefers-reduced-motion`, and browsers without support show static content.

## Credits

Layout inspired by [Brittany Chiang](https://brittanychiang.com)'s portfolio. The code is written from scratch, not forked from her template.
