import { Fragment, type ReactNode } from "react";
import type { ArticleBlock, InlineText } from "@/content/types";
import { BarChart } from "./BarChart";

/** Renders `backtick` spans as inline code; everything else as plain text. */
function Inline({ text }: { text: InlineText }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.9em] text-fg-strong">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Block({ block }: { block: ArticleBlock }): ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );

    case "heading":
      return <h2 className="pt-6 text-xl font-bold tracking-tight text-fg-strong">{block.text}</h2>;

    case "subheading":
      return <h3 className="pt-2 font-semibold text-fg-strong">{block.text}</h3>;

    case "callout":
      return (
        <p className="rounded-r-lg border-l-2 border-accent bg-accent-soft px-4 py-3 text-fg-strong">
          <Inline text={block.text} />
        </p>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className={`space-y-2 pl-5 marker:text-accent ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item) => (
            <li key={item.text}>
              {item.lead && <strong className="font-semibold text-fg-strong">{item.lead} </strong>}
              <Inline text={item.text} />
            </li>
          ))}
        </ListTag>
      );
    }

    case "code": {
      const pre = (
        <pre
          className="overflow-x-auto rounded-xl border border-border bg-card p-4 text-[13px] leading-relaxed text-fg-strong"
          // Lets keyboard users scroll long lines.
          tabIndex={0}
          aria-label={`${block.language.toUpperCase()} example`}
        >
          <code className="font-mono">{block.code}</code>
        </pre>
      );
      if (!block.caption) return pre;
      return (
        <figure>
          {pre}
          <figcaption className="mt-2 text-sm text-fg-muted">{block.caption}</figcaption>
        </figure>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label={block.caption}>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-card text-fg-strong">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-4 py-2.5 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-2.5 font-medium text-fg-strong">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-2.5">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "barChart":
      return <BarChart chart={block} />;
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-5 leading-relaxed">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
