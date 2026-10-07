"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./Icons";

/**
 * Flips between light and dark and remembers the choice. Which icon shows
 * is decided by CSS from <html data-theme>, so the server-rendered HTML is
 * correct before hydration and there's no icon flicker.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`rounded-md p-2 text-fg-muted transition-colors hover:text-fg-strong ${className}`}
    >
      <MoonIcon className="theme-icon-moon h-5 w-5" />
      <SunIcon className="theme-icon-sun h-5 w-5" />
    </button>
  );
}
