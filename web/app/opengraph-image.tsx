import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Rendered once at build time into a static PNG (1200×630) for link previews.
export const dynamic = "force-static";
export const alt = `${site.name}, ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>{site.name}</div>
        <div style={{ fontSize: 40, color: "#5eead4", marginTop: 16 }}>{site.title}</div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 40, maxWidth: 900, lineHeight: 1.4 }}>
          {site.pitch}
        </div>
      </div>
    ),
    size,
  );
}
