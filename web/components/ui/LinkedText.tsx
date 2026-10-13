import { Fragment, type ReactNode } from "react";
import Link from "next/link";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders plain text, turning Markdown-style `[label](href)` into links, so
 * content files can link a phrase without any markup. Site-internal paths use
 * Next's Link; anything else opens in a new tab.
 */
export function LinkedText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    // Both groups always match when the pattern does; this narrows the types.
    if (label === undefined || href === undefined) continue;
    const start = match.index;
    if (start > last) parts.push(<Fragment key={last}>{text.slice(last, start)}</Fragment>);

    const className =
      "font-medium text-fg-strong underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent";
    parts.push(
      href.startsWith("/") ? (
        <Link key={start} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    );
    last = start + whole.length;
  }

  if (last < text.length) parts.push(<Fragment key={last}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
