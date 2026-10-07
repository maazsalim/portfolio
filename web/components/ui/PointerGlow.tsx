"use client";

import { useEffect } from "react";

/**
 * Publishes the cursor position as the --x / --y CSS variables that the
 * .page-glow and spotlight-card styles read. One listener, at most one
 * update per frame, and nothing at all on touch screens.
 */
export function PointerGlow() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    let frame = 0;

    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--x", `${event.clientX}px`);
        root.style.setProperty("--y", `${event.clientY}px`);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div aria-hidden="true" className="page-glow" />;
}
