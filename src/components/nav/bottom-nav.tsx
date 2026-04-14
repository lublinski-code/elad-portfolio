"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

/**
 * Fixed item width for inactive items (per Figma spec: 140px).
 * Gap between items: 8px. Padding on each side: 24px.
 */
const ITEM_WIDTH = 140;
const GAP = 8;
const PAD = 24;

export default function BottomNav() {
  const { activeId, progress, setActiveId, isInnerPage, isTransitioning } =
    useActiveSection();
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  // Calculate translateX so the active item is visible and roughly centered.
  // Uses transform instead of scroll to completely bypass iOS touch scrolling.
  const computeTranslate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewportWidth = container.clientWidth;
    const activeIndex = sections.findIndex((s) => s.id === activeId);
    if (activeIndex < 0) return;

    // Total width of items before the active one
    const offsetBefore = activeIndex * (ITEM_WIDTH + GAP);

    // Center the active item in the viewport (accounting for container padding)
    const activeCenter = PAD + offsetBefore + ITEM_WIDTH / 2;
    const target = activeCenter - viewportWidth / 2;

    // Total strip width (all items at fixed width, plus gaps, plus padding)
    const totalWidth =
      PAD * 2 + sections.length * ITEM_WIDTH + (sections.length - 1) * GAP;
    const maxTranslate = Math.max(0, totalWidth - viewportWidth);

    setTranslateX(-Math.max(0, Math.min(target, maxTranslate)));
  }, [activeId]);

  useEffect(() => {
    computeTranslate();
  }, [activeId, computeTranslate]);

  // Recalculate on resize
  useEffect(() => {
    const onResize = () => computeTranslate();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeTranslate]);

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
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      style={{ background: "var(--cream)" }}
    >
      {/* Outer clip container: no scroll mechanics at all */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{
          paddingTop: 24,
          paddingBottom: `calc(24px + env(safe-area-inset-bottom))`,
        }}
      >
        {/* Inner strip: slides via transform, never scrolls */}
        <div
          className="flex"
          style={{
            gap: GAP,
            paddingLeft: PAD,
            paddingRight: PAD,
            transform: `translateX(${translateX}px)`,
            transition: isTransitioning
              ? "none"
              : "transform 250ms cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform",
          }}
        >
          {sections.map((s) => {
            const isActive = s.id === activeId;
            const isHome = s.id === "hi";

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] px-[16px] py-[16px] text-left"
                style={{
                  width: ITEM_WIDTH,
                  background: isActive ? s.selectedBg : "var(--white)",
                }}
              >
                {/* Section scroll progress indicator on active block */}
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
      </div>
    </nav>
  );
}
