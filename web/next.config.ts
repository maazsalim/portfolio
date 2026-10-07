import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build (written to /out) served by Azure Static Web Apps.
  output: "export",
  // Emit /projects/foo/index.html so SWA serves clean URLs without rewrites.
  trailingSlash: true,
  // The default image loader needs a server; images are pre-sized instead.
  images: { unoptimized: true },
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

export default nextConfig;
