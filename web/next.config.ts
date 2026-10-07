import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/** Local Azure Functions host started by `npm run dev` at the repo root. */
const LOCAL_API = "http://localhost:7071";

export default function config(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    // Production: a fully static build (written to /out) served by Azure Static Web Apps.
    // Dev: a normal dev server, so rewrites can forward /api to the local Functions host.
    output: isDev ? undefined : "export",
    // Emit /projects/foo/index.html so SWA serves clean URLs without rewrites.
    trailingSlash: true,
    // The default image loader needs a server; images are pre-sized instead.
    images: { unoptimized: true },
    // In production SWA routes /api to the Functions app; in dev, Next does it.
    // (trailingSlash redirects /api/x to /api/x/ first, hence the slash in source.)
    rewrites: isDev
      ? async () => [{ source: "/api/:path*/", destination: `${LOCAL_API}/api/:path*` }]
      : undefined,
    turbopack: {
      // The repo root has its own lockfile (dev tooling); this app lives in /web.
      root: __dirname,
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
