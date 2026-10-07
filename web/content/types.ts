/**
 * Shapes for everything in /content. Components only read these types,
 * so content can change freely without touching UI code.
 *
 * Convention: any string still containing "TODO" is placeholder copy
 * that needs real content before launch.
 */

export interface SiteConfig {
  /** Full name, used in the hero, page titles and metadata. */
  name: string;
  /** Short name for tight spaces (e.g. the nav). */
  shortName: string;
  title: string;
  /** One-line pitch shown under the title. */
  pitch: string;
  /** Short paragraphs for the About section. */
  about: string[];
  email: string;
  location: string;
  /** Canonical production URL, no trailing slash. Used for SEO and the sitemap. */
  url: string;
  /** Path under /public. */
  resumePath: string;
  githubUsername: string;
  links: {
    github: string;
    linkedin: string;
  };
}

export interface CaseStudy {
  problem: string;
  approach: string[];
  architecture: string[];
  challenges: string[];
  results: string[];
}

export interface Project {
  /** URL segment for /projects/[slug]. Lowercase, hyphenated. */
  slug: string;
  title: string;
  /** One line: what problem does this solve? */
  problem: string;
  role: string;
  period: string;
  tech: string[];
  links: {
    demo?: string;
    repo?: string;
  };
  caseStudy: CaseStudy;
}

export type EmploymentType = "Full-time" | "Co-op" | "Contract";

export interface Experience {
  company: string;
  role: string;
  type: EmploymentType;
  location: string;
  /** Display strings, e.g. "May 2023". */
  start: string;
  end: string | "Present";
  bullets: string[];
  tech: string[];
}

export interface SkillGroup {
  name: string;
  skills: string[];
}
