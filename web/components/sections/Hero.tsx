import { site } from "@/content/site";
import { DocumentIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { SectionNav, type NavItem } from "@/components/ui/SectionNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Left column on desktop (sticky), top of the page on mobile.
 * Everything a recruiter needs in the first few seconds lives here.
 */
export function Hero({ navItems }: { navItems: NavItem[] }) {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-fg-strong sm:text-5xl">{site.name}</h1>
        <p className="mt-3 text-lg font-medium tracking-tight text-fg-strong sm:text-xl">{site.title}</p>
        <p className="mt-4 max-w-sm leading-normal">{site.pitch}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.resumePath}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            <DocumentIcon className="h-4 w-4" />
            Resume <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            <LinkedInIcon className="h-4 w-4" />
            LinkedIn <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <SectionNav items={navItems} />
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm">
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-fg-strong"
        >
          <MailIcon className="h-5 w-5" />
          {site.email}
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
