import { experience } from "@/content/experience";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/TagList";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="group/list space-y-12">
        {experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <article className="grid gap-1 rounded-lg transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:p-4 lg:group-hover/list:opacity-60 lg:hover:opacity-100! lg:hover:bg-surface/50 lg:hover:shadow-lg">
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
