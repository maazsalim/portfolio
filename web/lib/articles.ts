import type { Article, ArticleBlock } from "@/content/types";

const WORDS_PER_MINUTE = 220;

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "subheading":
    case "callout":
      return block.text;
    case "list":
      return block.items.map((item) => `${item.lead ?? ""} ${item.text}`).join(" ");
    case "code":
      return block.code;
    case "table":
      return [...block.head, ...block.rows.flat()].join(" ");
    case "barChart":
      return block.bars.map((bar) => bar.label).join(" ");
  }
}

/** Estimated reading time in whole minutes (at least 1). */
export function readingMinutes(article: Article): number {
  const words = article.body.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "2026-10-13" → "October 2026". Parsed as UTC so the month never shifts by timezone. */
export function formatPublished(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function articleHref(slug: string): string {
  return `/writing/${slug}/`;
}
