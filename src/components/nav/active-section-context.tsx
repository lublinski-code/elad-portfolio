"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { sections, type SectionId } from "./sections";

type ActiveSectionState = {
  activeId: SectionId;
  progress: number;
  isInnerPage: boolean;
  isTransitioning: boolean;
  pageTitle: string | null;
  setActiveId: (id: SectionId) => void;
  setPageTitle: (title: string | null) => void;
};

const ActiveSectionContext = createContext<ActiveSectionState>({
  activeId: "hi",
  progress: 0,
  isInnerPage: false,
  isTransitioning: false,
  pageTitle: null,
  setActiveId: () => {},
  setPageTitle: () => {},
});

/** Global page progress for inner (work) pages */
function computePageProgress(): number {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return Math.max(0, Math.min(1, window.scrollY / maxScroll));
}

/**
 * Compute boundary-based progress for a section.
 * Maps the scrollY range during which the section is active to 0→1.
 *
 * Boundaries are the midpoints between adjacent sections — roughly where
 * the viewport-center detection switches from one section to the next.
 */
/**
 * Progress 0→1 across the scroll range where this section is active.
 * Uses the same midpoint logic as the detection, so progress always
 * reaches exactly 0 at the start and 1 at the end of the active range.
 */
function computeBoundaryProgress(
  activeIdx: number,
  rects: (DOMRect | null)[],
  scrollY: number,
  vh: number,
  maxScroll: number,
): number {
  const center = vh / 2;

  // Start: where this section becomes active (midpoint from prev)
  let startScroll = 0;
  if (activeIdx > 0) {
    const prevRect = rects[activeIdx - 1];
    const thisRect = rects[activeIdx];
    if (prevRect && thisRect) {
      const prevBottom = scrollY + prevRect.bottom;
      const thisTop = scrollY + thisRect.top;
      startScroll = Math.max(0, (prevBottom + thisTop) / 2 - center);
    }
  }

  // End: where this section loses active (midpoint to next)
  let endScroll = maxScroll;
  if (activeIdx < sections.length - 1) {
    const thisRect = rects[activeIdx];
    const nextRect = rects[activeIdx + 1];
    if (thisRect && nextRect) {
      const thisBottom = scrollY + thisRect.bottom;
      const nextTop = scrollY + nextRect.top;
      endScroll = Math.max(startScroll, (thisBottom + nextTop) / 2 - center);
    }
  }

  const range = endScroll - startScroll;
  if (range <= 0) return scrollY >= startScroll ? 1 : 0;
  return Math.max(0, Math.min(1, (scrollY - startScroll) / range));
}

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInnerPage = pathname !== "/";

  const [activeId, setActiveIdState] = useState<SectionId>(
    isInnerPage ? "work" : "hi",
  );
  const [progress, setProgress] = useState(0);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const overrideRef = useRef<SectionId | null>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrivedRef = useRef(false);
  const prevPathRef = useRef(pathname);

  // Detect page transitions: suppress nav animations briefly when pathname changes
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // On inner pages, lock active to "work"
  useEffect(() => {
    if (isInnerPage) {
      setActiveIdState("work");
    }
  }, [isInnerPage]);

  const setActiveId = useCallback(
    (id: SectionId) => {
      if (isInnerPage) return;
      overrideRef.current = id;
      arrivedRef.current = false;
      setActiveIdState(id);
      setProgress(0);
    },
    [isInnerPage],
  );

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;

      if (isInnerPage) {
        setProgress(computePageProgress());
        return;
      }

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      const maxScroll = document.documentElement.scrollHeight - vh;

      // Collect all section rects
      const rects: (DOMRect | null)[] = sections.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect() : null;
      });

      // Handle click-override: keep active section locked, compute its progress
      if (overrideRef.current) {
        const idx = sections.findIndex((s) => s.id === overrideRef.current);
        if (idx >= 0) {
          const p = computeBoundaryProgress(idx, rects, scrollY, vh, maxScroll);

          if (!arrivedRef.current) {
            if (p <= 0.05) {
              arrivedRef.current = true;
              setProgress(p);
            }
          } else {
            setProgress(p);
          }
        }

        if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = setTimeout(() => {
          overrideRef.current = null;
          arrivedRef.current = false;
        }, 150);
        return;
      }

      // At bottom of page: force last section active
      if (scrollY >= maxScroll - 2) {
        const lastIdx = sections.length - 1;
        setActiveIdState(sections[lastIdx].id);
        setProgress(1);
        return;
      }

      // Find active section (closest to viewport center)
      let bestId: SectionId = "hi";
      let bestDistance = Infinity;
      let bestIdx = 0;

      for (let i = 0; i < sections.length; i++) {
        const rect = rects[i];
        if (!rect) continue;
        const inside =
          rect.top <= viewportCenter && rect.bottom >= viewportCenter;
        const distance = inside
          ? 0
          : Math.min(
              Math.abs(rect.top - viewportCenter),
              Math.abs(rect.bottom - viewportCenter),
            );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = sections[i].id;
          bestIdx = i;
        }
      }

      setActiveIdState(bestId);
      setProgress(computeBoundaryProgress(bestIdx, rects, scrollY, vh, maxScroll));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    };
  }, [isInnerPage]);

  const value = useMemo(
    () => ({ activeId, progress, isInnerPage, isTransitioning, pageTitle, setActiveId, setPageTitle }),
    [activeId, progress, isInnerPage, isTransitioning, pageTitle, setActiveId],
  );

  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
