"use client";

import { useEffect, useRef, useCallback } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

export default function BottomNav() {
  const { activeId, progress, setActiveId, isInnerPage, isTransitioning } = useActiveSection();
  const stripRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const animRef = useRef<number | null>(null);

  // Smoothly animate scrollLeft on an overflow-hidden container
  const scrollToBlock = useCallback(
    (instant: boolean) => {
      const strip = stripRef.current;
      const block = blockRefs.current[activeId];
      if (!strip || !block) return;

      const stripLeft = strip.getBoundingClientRect().left;
      const blockRect = block.getBoundingClientRect();
      const blockCenter = blockRect.left - stripLeft + strip.scrollLeft + blockRect.width / 2;
      const target = Math.max(0, blockCenter - strip.clientWidth / 2);

      if (instant) {
        strip.scrollLeft = target;
        return;
      }

      // Lerp animation for smooth scroll on overflow-hidden
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const start = strip.scrollLeft;
      const delta = target - start;
      if (Math.abs(delta) < 1) return;
      const duration = 250;
      const t0 = performance.now();

      const step = (now: number) => {
        const elapsed = now - t0;
        const p = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - p, 3);
        strip.scrollLeft = start + delta * ease;
        if (p < 1) animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    },
    [activeId],
  );

  useEffect(() => {
    scrollToBlock(isTransitioning);
  }, [activeId, isTransitioning, scrollToBlock]);

  const handleClick = (id: string) => {
    if (isInnerPage) {
      window.location.href = `/#${id}`;
      return;
    }
    if (id === "hi") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setActiveId(id as typeof activeId);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden"
      style={{ background: "var(--cream)" }}
    >
      <div
        ref={stripRef}
        className="flex w-full gap-[8px] overflow-hidden px-[24px] py-[24px]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
      >
        {sections.map((s) => {
          const isActive = s.id === activeId;
          const isHome = s.id === "hi";

          return (
            <button
              key={s.id}
              ref={(el) => {
                blockRefs.current[s.id] = el;
              }}
              type="button"
              onClick={() => handleClick(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={`relative flex shrink-0 items-center overflow-hidden rounded-[16px] px-[16px] py-[16px] text-left${isTransitioning ? "" : " transition-[flex] duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
              style={{
                background: isActive ? s.selectedBg : "var(--white)",
                flex: isActive ? "2 0 auto" : "0 0 auto",
                minWidth: isActive ? 140 : 80,
              }}
            >
              {/* Scroll progress fill on active block */}
              {isActive && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 h-[3px]"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.85)",
                    transform: `scaleX(${progress})`,
                    transformOrigin: "left",
                    transition: "transform 80ms linear",
                  }}
                />
              )}
              <span
                className="whitespace-nowrap font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: isActive ? "var(--white)" : "var(--black)",
                }}
              >
                {isHome ? s.label : `/${s.label}`}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
