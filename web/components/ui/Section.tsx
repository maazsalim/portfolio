import type { ReactNode } from "react";

/**
 * A page section with an accessible heading. On small screens the heading
 * sticks to the top while you scroll through that section.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
        <h2 id={headingId} className="text-sm font-bold tracking-widest text-fg-strong uppercase">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
