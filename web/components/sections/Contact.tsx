import { site } from "@/content/site";
import { LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="mb-6 leading-relaxed">
        Open to full-time roles and interesting projects. Send a message below, or reach me directly.
      </p>
      <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        <li>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-fg-strong hover:text-accent">
            <MailIcon className="h-4 w-4" />
            {site.email}
          </a>
        </li>
        <li>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-fg-strong hover:text-accent"
          >
            <LinkedInIcon className="h-4 w-4" />
            LinkedIn <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      </ul>
      <div className="reveal">
        <ContactForm />
      </div>
    </Section>
  );
}
