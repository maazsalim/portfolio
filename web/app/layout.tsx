import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { InlineScript } from "@/components/ui/InlineScript";
import { PointerGlow } from "@/components/ui/PointerGlow";
import { site } from "@/content/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description = `${site.title} in ${site.location}. ${site.pitch}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`,
  },
  description,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} | ${site.title}`,
    description,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme before React hydrates.
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body className="font-sans leading-relaxed">
        <PointerGlow />
        <a
          href="#content"
          className="fixed top-4 left-4 z-50 -translate-y-24 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
