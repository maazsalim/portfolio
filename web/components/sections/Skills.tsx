import { skills } from "@/content/skills";
import { Section } from "@/components/ui/Section";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.name}>
            <dt className="text-sm font-semibold text-fg-strong">{group.name}</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2" aria-label={`${group.name} skills`}>
                {group.skills.map((skill) => (
                  <li key={skill} className="rounded-md border border-border px-2.5 py-1 text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
