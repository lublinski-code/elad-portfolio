"use client";

import { useEffect } from "react";

const KEY = "home-scroll-y";

/**
 * Saves window.scrollY to sessionStorage when navigating to a work page
 * and restores it when returning home (mount / browser Back).
 *
 * Mounts once at the home page root.
 */
export default function ScrollRestore() {
  useEffect(() => {
    // Hash navigation from inner pages (e.g. nav clicking "/#work")
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.documentElement.style.scrollBehavior = "auto";
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = "";
      });
      sessionStorage.removeItem(KEY);
      return;
    }

    // Restore saved scroll position (e.g. browser Back from inner page)
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      const y = Number(stored);
      sessionStorage.removeItem(KEY);
      if (!Number.isNaN(y) && y > 0) {
        // Temporarily disable CSS smooth scrolling so restore is instant
        document.documentElement.style.scrollBehavior = "auto";
        // Double-rAF: first frame schedules layout, second frame renders content
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: "instant" });
            // Re-enable after restore
            requestAnimationFrame(() => {
              document.documentElement.style.scrollBehavior = "";
            });
          });
        });
      }
    }

    // Save scroll position when clicking a work link (before client-side nav)
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (href && href.startsWith("/work/")) {
        sessionStorage.setItem(KEY, String(window.scrollY));
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
