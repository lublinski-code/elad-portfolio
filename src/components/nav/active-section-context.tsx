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
import { sections, type SectionId } from "./sections";

type ActiveSectionState = {
  activeId: SectionId;
  /** 0..1 progress — how far through the active section we've scrolled */
  progress: number;
  /** Imperatively set the active section (used on click for instant switch) */
  setActiveId: (id: SectionId) => void;
};

const ActiveSectionContext = createContext<ActiveSectionState>({
  activeId: "hi",
  progress: 0,
  setActiveId: () => {},
});

function computeProgress(id: string): number {
  const el = document.getElementById(id);
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const scrollable = rect.height - vh;
  if (scrollable <= 0) {
    return rect.top <= 0 ? 1 : 0;
  }
  const raw = -rect.top / scrollable;
  return Math.max(0, Math.min(1, raw));
}

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeId, setActiveIdState] = useState<SectionId>("hi");
  const [progress, setProgress] = useState(0);

  // Override: when user clicks a pill, lock to that section until scroll settles
  const overrideRef = useRef<SectionId | null>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether we've "arrived" at the section top during override
  const arrivedRef = useRef(false);

  const setActiveId = useCallback((id: SectionId) => {
    overrideRef.current = id;
    arrivedRef.current = false;
    setActiveIdState(id);
    // Notch starts at top
    setProgress(0);
  }, []);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;

      if (overrideRef.current) {
        const realProgress = computeProgress(overrideRef.current);

        // Only start tracking once the section top has reached the viewport top
        // (progress near 0 means we've arrived at the start of the section)
        if (!arrivedRef.current) {
          if (realProgress <= 0.05) {
            arrivedRef.current = true;
            setProgress(realProgress);
          }
          // Otherwise keep progress at 0 (notch stays at top while scrolling to section)
        } else {
          setProgress(realProgress);
        }

        // Reset idle timer — release override when scrolling stops
        if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = setTimeout(() => {
          overrideRef.current = null;
          arrivedRef.current = false;
        }, 150);
        return;
      }

      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      let bestId: SectionId = "hi";
      let bestDistance = Infinity;

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
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
          bestId = s.id;
        }
      }

      setActiveIdState(bestId);
      setProgress(computeProgress(bestId));
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
  }, []);

  const value = useMemo(
    () => ({ activeId, progress, setActiveId }),
    [activeId, progress, setActiveId],
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
