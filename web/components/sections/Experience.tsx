import { experience } from "@/content/experience";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/TagList";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="group/list space-y-12">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`} className="reveal">
            <article className="grid gap-1 rounded-xl transition-all duration-300 sm:grid-cols-8 sm:gap-8 md:gap-4 lg:spotlight-card lg:p-5 lg:group-hover/list:opacity-60 lg:hover:-translate-y-0.5 lg:hover:opacity-100! lg:hover:shadow-[0_12px_40px_-16px_var(--accent)]">
              <p className="mt-1 text-xs font-semibold tracking-wide text-fg-muted uppercase sm:col-span-2">
                {job.start} – {job.end}
              </p>
              <div className="sm:col-span-6">
                <h3 className="leading-snug font-semibold text-fg-strong">
                  {job.role} · {job.company}
                </h3>
                <p className="text-xs text-fg-muted">
                  {job.type} · {job.location}
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-normal marker:text-accent">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <TagList tags={job.tech} label={`Technologies used at ${job.company}`} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
