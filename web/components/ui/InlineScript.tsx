/**
 * An inline <script> that runs once from the server-rendered HTML, before
 * React loads. On the client the type becomes "text/plain", so React doesn't
 * warn about rendering a script it will never execute. suppressHydrationWarning
 * covers that intentional server/client difference.
 *
 * Pattern from the Next.js guide "How to prevent flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
