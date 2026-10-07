/**
 * Typed client for the C# Azure Functions API (/api).
 * These shapes mirror the DTOs in api/Portfolio.Api/Models.
 */

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  /** Honeypot. Real users never see or fill this field. */
  website: string;
}

export type ContactField = "name" | "email" | "message";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors: Partial<Record<ContactField, string>>;
    };

export interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubActivity {
  profileUrl: string;
  repos: RepoSummary[];
}

/** Subset of RFC 9457 problem details returned by the API on errors. */
interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

const GENERIC_ERROR = "Something went wrong. Please email me directly instead.";

export async function sendContactMessage(request: ContactRequest): Promise<ContactResult> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    return { ok: false, message: GENERIC_ERROR, fieldErrors: {} };
  }

  if (response.ok) return { ok: true };

  if (response.status === 429) {
    return {
      ok: false,
      message: "Too many messages from your connection. Please try again later.",
      fieldErrors: {},
    };
  }

  const problem = (await response.json().catch(() => ({}))) as ProblemDetails;
  const fieldErrors: Partial<Record<ContactField, string>> = {};
  for (const [key, messages] of Object.entries(problem.errors ?? {})) {
    const field = key.toLowerCase();
    if ((field === "name" || field === "email" || field === "message") && messages[0]) {
      fieldErrors[field] = messages[0];
    }
  }

  return {
    ok: false,
    message: problem.detail ?? problem.title ?? GENERIC_ERROR,
    fieldErrors,
  };
}

export async function getGitHubActivity(signal?: AbortSignal): Promise<GitHubActivity> {
  const response = await fetch("/api/github", { signal });
  if (!response.ok) throw new Error(`GitHub activity request failed: ${response.status}`);
  return (await response.json()) as GitHubActivity;
}
