import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { ArrowLeftIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/ui/Icons";
import { TagList } from "@/components/ui/TagList";

// Static export: only the slugs in content/projects.ts exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) return {};

  const path = `/projects/${project.slug}/`;
  return {
    title: `${project.title} case study`,
    description: project.problem,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${project.title} | ${site.name}`, description: project.problem },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();

  const { title, problem, role, period, tech, links, caseStudy } = project;

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-12 md:px-12 md:py-20">
      <Link
        href="/#projects"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {site.name}
      </Link>

      <main id="content" tabIndex={-1} className="outline-none">
        <article>
          <header className="mt-8 border-b border-border pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-fg-strong sm:text-4xl">{title}</h1>
            <p className="mt-3 text-lg">{problem}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-fg-muted">Role</dt>
                <dd className="font-medium text-fg-strong">{role}</dd>
              </div>
              <div>
                <dt className="text-fg-muted">When</dt>
                <dd className="font-medium text-fg-strong">{period}</dd>
              </div>
            </dl>
            <TagList tags={tech} label={`Technologies used in ${title}`} />
            {(links.demo || links.repo) && (
              <div className="mt-6 flex gap-4 text-sm font-semibold">
                {links.demo && (
                  <a href={links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-strong hover:text-accent">
                    <ArrowUpRightIcon className="h-4 w-4" /> Live demo
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                {links.repo && (
                  <a href={links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg-strong hover:text-accent">
                    <GitHubIcon className="h-4 w-4" /> Source code
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}
          </header>

          <CaseStudySection title="The problem">
            <p>{caseStudy.problem}</p>
          </CaseStudySection>
          <CaseStudySection title="Approach">
            <BulletList items={caseStudy.approach} />
          </CaseStudySection>
          <CaseStudySection title="Architecture">
            <BulletList items={caseStudy.architecture} />
          </CaseStudySection>
          <CaseStudySection title="Challenges">
            <BulletList items={caseStudy.challenges} />
          </CaseStudySection>
          <CaseStudySection title="Results">
            <BulletList items={caseStudy.results} />
          </CaseStudySection>
        </article>
      </main>
    </div>
  );
}

function CaseStudySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-bold tracking-widest text-fg-strong uppercase">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
