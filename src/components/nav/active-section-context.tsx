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
  pageTitle: string | null;
  setActiveId: (id: SectionId) => void;
  setPageTitle: (title: string | null) => void;
};

const ActiveSectionContext = createContext<ActiveSectionState>({
  activeId: "hi",
  progress: 0,
  isInnerPage: false,
  pageTitle: null,
  setActiveId: () => {},
  setPageTitle: () => {},
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

/** On inner pages, compute progress based on total document scroll */
function computePageProgress(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 0;
  return Math.max(0, Math.min(1, scrollTop / docHeight));
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

  const overrideRef = useRef<SectionId | null>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrivedRef = useRef(false);

  // On inner pages, lock active to "work"
  useEffect(() => {
    if (isInnerPage) {
      setActiveIdState("work");
    }
  }, [isInnerPage]);

  const setActiveId = useCallback(
    (id: SectionId) => {
      if (isInnerPage) return; // Don't override on inner pages
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

      // Inner pages: track total page scroll, always locked to "work"
      if (isInnerPage) {
        setProgress(computePageProgress());
        return;
      }

      if (overrideRef.current) {
        const realProgress = computeProgress(overrideRef.current);

        if (!arrivedRef.current) {
          if (realProgress <= 0.05) {
            arrivedRef.current = true;
            setProgress(realProgress);
          }
        } else {
          setProgress(realProgress);
        }

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
  }, [isInnerPage]);

  const value = useMemo(
    () => ({ activeId, progress, isInnerPage, pageTitle, setActiveId, setPageTitle }),
    [activeId, progress, isInnerPage, pageTitle, setActiveId],
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
