import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { site } from "@/content/site";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArrowLeftIcon } from "@/components/ui/Icons";
import { articleHref, formatPublished, readingMinutes } from "@/lib/articles";

// Static export: only the slugs in content/articles.ts exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function generateMetadata(props: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = findArticle(slug);
  if (!article) return {};

  const path = articleHref(article.slug);
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.summary,
      publishedTime: article.published,
      authors: [site.name],
    },
  };
}

export default async function ArticlePage(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const article = findArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-12 md:px-12 md:py-20">
      <Link href="/#writing" className="group inline-flex items-center gap-2 text-sm font-semibold text-accent">
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {site.name}
      </Link>

      <main id="content" tabIndex={-1} className="outline-none">
        <article>
          <header className="mt-8 border-b border-border pb-8">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase">{article.kicker}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-strong sm:text-4xl">{article.title}</h1>
            <p className="mt-3 text-lg">{article.summary}</p>
            <p className="mt-4 text-sm text-fg-muted">
              {site.name} · <time dateTime={article.published}>{formatPublished(article.published)}</time> ·{" "}
              {readingMinutes(article)} min read
            </p>
          </header>

          <div className="mt-8">
            <ArticleBody blocks={article.body} />
          </div>
        </article>
      </main>
    </div>
  );
}
