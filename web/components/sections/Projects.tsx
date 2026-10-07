import Link from "next/link";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/TagList";

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ol className="group/list space-y-10 lg:space-y-12">
        {projects.map((project) => (
          <li key={project.slug} className="reveal">
            <ProjectCard project={project} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { slug, title, problem, role, tech, links } = project;

  return (
    <article className="spotlight-card group relative grid gap-2 rounded-xl p-5 transition-all duration-300 lg:group-hover/list:opacity-60 lg:hover:-translate-y-0.5 lg:hover:opacity-100! lg:hover:shadow-[0_12px_40px_-16px_var(--accent)]">
      <h3 className="font-semibold leading-snug text-fg-strong">
        {/* The ::after makes the whole card clickable while keeping one real link. */}
        <Link
          href={`/projects/${slug}/`}
          className="inline-flex items-baseline gap-1 transition-colors after:absolute after:inset-0 after:rounded-xl hover:text-accent focus-visible:text-accent"
        >
          {title}
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 translate-y-px transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">: read the case study</span>
        </Link>
      </h3>
      <p className="text-sm leading-normal">{problem}</p>
      <p className="text-xs text-fg-muted">
        <span className="font-semibold">Role:</span> {role}
      </p>
      <TagList tags={tech} label={`Technologies used in ${title}`} />

      {(links.demo || links.repo) && (
        // relative z-10 lifts these links above the card-wide click target.
        <div className="relative z-10 mt-2 flex gap-4 text-sm font-medium">
          {links.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg-strong hover:text-accent"
            >
              <ArrowUpRightIcon className="h-4 w-4" />
              Live demo <span className="sr-only">of {title} (opens in a new tab)</span>
            </a>
          )}
          {links.repo && (
            <a
              href={links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg-strong hover:text-accent"
            >
              <GitHubIcon className="h-4 w-4" />
              Source <span className="sr-only">code for {title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
