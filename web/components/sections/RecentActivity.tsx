"use client";

import { useEffect, useState } from "react";
import { getGitHubActivity, type RepoSummary } from "@/lib/api";
import { site } from "@/content/site";
import { ArrowUpRightIcon, StarIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";

type State =
  | { status: "loading" }
  | { status: "ready"; repos: RepoSummary[] }
  | { status: "error" };

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(iso: string): string {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days > -1) return "today";
  if (days > -30) return relativeTime.format(days, "day");
  if (days > -365) return relativeTime.format(Math.round(days / 30), "month");
  return relativeTime.format(Math.round(days / 365), "year");
}

/**
 * Recently pushed GitHub repos from GET /api/github. Loaded in the browser so the
 * rest of the site stays fully static. If the API is down, the section
 * quietly falls back to a link to the GitHub profile.
 */
export function RecentActivity() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    getGitHubActivity(controller.signal)
      .then((data) => setState({ status: "ready", repos: data.repos }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  return (
    <Section id="activity" title="On GitHub">
      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && <ActivitySkeleton />}
        {state.status === "ready" && state.repos.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {state.repos.map((repo) => (
              <li key={repo.name}>
                <RepoCard repo={repo} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-fg-strong hover:text-accent"
      >
        {state.status === "error" ? "See my work on GitHub" : "View all repositories"}
        <ArrowUpRightIcon className="h-4 w-4" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </Section>
  );
}

function RepoCard({ repo }: { repo: RepoSummary }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-accent"
    >
      <span className="text-sm font-semibold text-fg-strong">{repo.name}</span>
      {repo.description && <span className="mt-1 line-clamp-2 text-sm">{repo.description}</span>}
      <span className="mt-auto flex items-center gap-3 pt-3 text-xs text-fg-muted">
        {repo.language && <span>{repo.language}</span>}
        {repo.stars > 0 && (
          <span className="inline-flex items-center gap-1">
            <StarIcon className="h-3 w-3" />
            {repo.stars}
            <span className="sr-only">stars</span>
          </span>
        )}
        <span>Updated {timeAgo(repo.pushedAt)}</span>
      </span>
    </a>
  );
}

function ActivitySkeleton() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" aria-label="Loading GitHub repositories">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="h-24 animate-pulse rounded-lg bg-surface" />
      ))}
    </ul>
  );
}
