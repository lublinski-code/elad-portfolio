"use client";

import { useEffect, useRef } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

export default function BottomNav() {
  const { activeId, progress, setActiveId, isInnerPage, isTransitioning } = useActiveSection();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll to center the active block (no user scrolling)
  useEffect(() => {
    const scroller = scrollerRef.current;
    const block = blockRefs.current[activeId];
    if (!scroller || !block) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const blockCenter = blockRect.left - scrollerRect.left + scroller.scrollLeft + blockRect.width / 2;
    const targetScroll = blockCenter - scrollerRect.width / 2;

    scroller.scrollTo({
      left: targetScroll,
      behavior: isTransitioning ? "instant" : "smooth",
    });
  }, [activeId, isTransitioning]);

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
        ref={scrollerRef}
        className="no-scrollbar flex w-full gap-[8px] overflow-x-scroll px-[24px] py-[24px]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))", touchAction: "none", overscrollBehaviorX: "none" }}
        onWheel={(e) => e.preventDefault()}
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
