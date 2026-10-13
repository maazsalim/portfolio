import Link from "next/link";
import { articles } from "@/content/articles";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { articleHref, formatPublished, readingMinutes } from "@/lib/articles";

export function Writing() {
  if (articles.length === 0) return null;

  return (
    <Section id="writing" title="Writing">
      <ol className="group/list space-y-6">
        {articles.map((article) => (
          <li key={article.slug} className="reveal">
            <article className="spotlight-card group relative grid gap-2 rounded-xl p-5 transition-all duration-300 lg:group-hover/list:opacity-60 lg:hover:-translate-y-0.5 lg:hover:opacity-100! lg:hover:shadow-[0_12px_40px_-16px_var(--accent)]">
              <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
                {article.kicker} · <time dateTime={article.published}>{formatPublished(article.published)}</time> ·{" "}
                {readingMinutes(article)} min read
              </p>
              <h3 className="font-semibold leading-snug text-fg-strong">
                {/* The ::after makes the whole card clickable while keeping one real link. */}
                <Link
                  href={articleHref(article.slug)}
                  className="inline-flex items-baseline gap-1 transition-colors after:absolute after:inset-0 after:rounded-xl hover:text-accent focus-visible:text-accent"
                >
                  {article.title}
                  <ArrowUpRightIcon className="h-4 w-4 shrink-0 translate-y-px transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </h3>
              <p className="text-sm leading-normal">{article.summary}</p>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
