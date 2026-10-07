"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
}

/**
 * Desktop-only anchor nav that highlights the section currently in view.
 * Works as plain anchor links without JS; the observer only adds the highlight.
 */
export function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      // A thin band near the top of the viewport decides the "current" section.
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Sections" className="hidden lg:block">
      <ul className="mt-16 w-max space-y-1">
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className="group flex items-center py-2"
              >
                <span
                  className={`mr-4 h-px transition-all motion-reduce:transition-none ${
                    isActive
                      ? "w-16 bg-fg-strong"
                      : "w-8 bg-fg-muted group-hover:w-16 group-hover:bg-fg-strong group-focus-visible:w-16"
                  }`}
                />
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${
                    isActive ? "text-fg-strong" : "text-fg-muted group-hover:text-fg-strong"
                  }`}
                >
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
