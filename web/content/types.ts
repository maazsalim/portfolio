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

export interface DemoVideo {
  /** Path under /public, e.g. "/videos/demo.mp4". H.264 MP4 for browser support. */
  src: string;
  /** Still frame shown before playback; also reserves the layout space. */
  poster: string;
  /** Short text for the play link and screen readers, e.g. "2-minute walkthrough". */
  description: string;
}

export interface DemoLogin {
  email: string;
  password: string;
  /** Shown on the case study, e.g. a slow first load on free hosting. */
  note?: string;
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
    /** A live, deployed version. */
    demo?: string;
    repo?: string;
  };
  /** A recorded walkthrough hosted with the site, shown on the case study. */
  video?: DemoVideo;
  /** Public demo account for the live app (fake data only). */
  demoLogin?: DemoLogin;
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
  /** Supports Markdown-style links: "[cut sync time](/writing/some-article/)". */
  bullets: string[];
  tech: string[];
  /** Optional link to a related article, e.g. a write-up of one of the bullets. */
  writeUp?: { href: string; label: string };
}

/* ---------- Articles ("Writing") ---------- */

/**
 * Inline text in article blocks. Wrap code in backticks (`like this`) and it
 * renders as inline code; everything else is plain text.
 */
export type InlineText = string;

export type ArticleBlock =
  | { type: "paragraph"; text: InlineText }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  /** A highlighted takeaway. */
  | { type: "callout"; text: InlineText }
  /** `lead` is shown in bold before the item text. */
  | { type: "list"; ordered?: boolean; items: { lead?: string; text: InlineText }[] }
  /** `caption` is a short note shown under the code. */
  | { type: "code"; language: string; code: string; caption?: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  /** Horizontal bars drawn to the same scale, e.g. before/after timings. */
  | {
      type: "barChart";
      caption: string;
      unit: string;
      max: number;
      ticks: number[];
      bars: { label: string; value: number; display: string; highlight?: boolean }[];
    };

export interface Article {
  /** URL segment for /writing/[slug]. */
  slug: string;
  /** Small label above the title, e.g. "Engineering notes". */
  kicker: string;
  title: string;
  /** One or two sentences under the title, also used for the card and SEO. */
  summary: string;
  /** ISO date, e.g. "2026-10-13". */
  published: string;
  body: ArticleBlock[];
}

export interface SkillGroup {
  name: string;
  skills: string[];
}
