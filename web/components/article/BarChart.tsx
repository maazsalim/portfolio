import type { ArticleBlock } from "@/content/types";

type BarChartBlock = Extract<ArticleBlock, { type: "barChart" }>;

/**
 * Horizontal bars on a shared axis, pure HTML/CSS. The visual is hidden from
 * screen readers in favour of a plain-text summary of the same numbers.
 */
export function BarChart({ chart }: { chart: BarChartBlock }) {
  const summary = chart.bars.map((bar) => `${bar.label}: ${bar.display}`).join(". ");

  return (
    <figure className="rounded-xl border border-border bg-card p-5">
      <figcaption className="mb-4 text-sm font-semibold text-fg-strong">
        {chart.caption} <span className="font-normal text-fg-muted">({chart.unit})</span>
      </figcaption>
      <p className="sr-only">{summary}.</p>

      <div aria-hidden="true" className="space-y-4">
        {chart.bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
              <span>{bar.label}</span>
              <span className={`font-semibold ${bar.highlight ? "text-accent" : "text-fg-strong"}`}>{bar.display}</span>
            </div>
            <div className="h-3 rounded-full bg-bg">
              <div
                className={`h-3 rounded-full ${bar.highlight ? "bg-accent" : "bg-fg-muted"}`}
                // Keep tiny values visible as a sliver rather than vanishing.
                style={{ width: `max(${(bar.value / chart.max) * 100}%, 0.5rem)` }}
              />
            </div>
          </div>
        ))}

        <div className="relative h-4 text-xs text-fg-muted">
          {chart.ticks.map((tick, i) => (
            <span
              key={tick}
              className="absolute whitespace-nowrap"
              style={{
                left: `${(tick / chart.max) * 100}%`,
                transform: i === 0 ? "none" : i === chart.ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
