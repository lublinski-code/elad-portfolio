"use client";

import { useEffect, useRef } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

export default function BottomNav() {
  const { activeId, progress, setActiveId } = useActiveSection();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-center the active block
  useEffect(() => {
    const block = blockRefs.current[activeId];
    if (!block) return;
    block.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId]);

  const handleClick = (id: string) => {
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
      {/* 24px padding on the sides matches the mobile bleed from Figma.
          The scrollable strip carries the colored pill cards. */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex w-full gap-[8px] overflow-x-auto scroll-smooth px-[24px] py-[24px]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
      >
        {/* Identity pill — always first */}
        <div
          className="flex shrink-0 items-center rounded-[16px] bg-white px-[16px] py-[16px]"
        >
          <span
            className="whitespace-nowrap font-mono text-[14px] font-normal leading-normal"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            Lublinski
          </span>
        </div>

        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              ref={(el) => {
                blockRefs.current[s.id] = el;
              }}
              type="button"
              onClick={() => handleClick(s.id)}
              aria-current={isActive ? "true" : undefined}
              className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] px-[16px] py-[16px] text-left transition-[flex] duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                background: s.bg,
                // Active section gets wider pill
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
                    background:
                      s.id === "contact" || s.id === "hi"
                        ? "rgba(0,0,0,0.85)"
                        : "rgba(255,255,255,0.85)",
                    transform: `scaleX(${progress})`,
                    transformOrigin: "left",
                    transition: "transform 80ms linear",
                  }}
                />
              )}
              <span
                className="whitespace-nowrap font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: s.id === "contact" ? "var(--black)" : "var(--white)",
                }}
              >
                /{s.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
