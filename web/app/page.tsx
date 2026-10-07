import { site } from "@/content/site";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RecentActivity } from "@/components/sections/RecentActivity";
import { Skills } from "@/components/sections/Skills";
import type { NavItem } from "@/components/ui/SectionNav";

const navItems: NavItem[] = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/** schema.org Person data, so search engines can show a richer result. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "McMaster University" },
  sameAs: [site.links.github, site.links.linkedin],
};

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Hero navItems={navItems} />
        <main id="content" tabIndex={-1} className="pt-16 outline-none lg:w-[52%] lg:py-24">
          <Projects />
          <Experience />
          <Skills />
          <About />
          <RecentActivity />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
