"use client";

import { useEffect } from "react";

const KEY = "home-scroll-y";

/**
 * Saves window.scrollY to sessionStorage on unmount (e.g. when navigating
 * to a /work/[slug] page) and restores it on mount (when returning home).
 *
 * Mounts once at the home page root.
 */
export default function ScrollRestore() {
  useEffect(() => {
    // Hash navigation from inner pages (e.g. nav clicking "/#work")
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        // Scroll immediately — no delay, no visible jump
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
      return;
    }

    // Restore on mount
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      const y = Number(stored);
      if (!Number.isNaN(y)) {
        // Wait for layout to settle so scroll target exists
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
      sessionStorage.removeItem(KEY);
    }

    // Save on navigation away
    const save = () => {
      sessionStorage.setItem(KEY, String(window.scrollY));
    };
    // Save on any link click before navigation
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (href && href.startsWith("/work/")) save();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("pagehide", save);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  return null;
}
