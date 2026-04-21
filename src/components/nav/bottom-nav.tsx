"use client";

import { useEffect, useRef } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

const ACTIVE_WIDTH = 280;
const INACTIVE_WIDTH = 142;

export default function BottomNav() {
  const { activeId, progress, setActiveId, isInnerPage, isTransitioning } =
    useActiveSection();
  const blockRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const stripRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to center the active item.
  // We write scrollLeft directly on the strip instead of calling
  // scrollIntoView on the button. scrollIntoView walks every scrollable
  // ancestor (including the document), and on mobile Chrome the smooth
  // animation gets cancelled or hijacked when it's fired while the user
  // is mid-scroll — the strip ends up frozen even though activeId is
  // updating. Writing scrollLeft only touches the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const block = blockRefs.current[activeId];
    if (!strip || !block) return;
    const target =
      block.offsetLeft - strip.clientWidth / 2 + block.offsetWidth / 2;
    strip.scrollTo({
      left: Math.max(0, target),
      behavior: isTransitioning ? "instant" : "smooth",
    });
  }, [activeId, isTransitioning]);

  const handleClick = (id: string) => {
    if (isInnerPage) {
      window.location.href = `/#${id}`;
      return;
    }
    if (id === "hi") {
      setActiveId("hi");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setActiveId(id as typeof activeId);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      style={{ background: "var(--cream)" }}
    >
      <div
        ref={stripRef}
        className="no-scrollbar flex w-full gap-[8px] overflow-x-auto px-[24px] py-[24px]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
      >
        {sections.map((s, i) => {
          const isActive = i === activeIndex;
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
              className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] text-left"
              style={{
                width: isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH,
                padding: 16,
                background: isActive ? s.selectedBg : "var(--white)",
                transition: isTransitioning
                  ? "none"
                  : "width 250ms cubic-bezier(0.32, 0.72, 0, 1), background 250ms cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 h-[3px]"
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
                  transition: "color 200ms ease",
                }}
              >
                {isHome ? `--- ${s.label}` : `/${s.label}`}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
