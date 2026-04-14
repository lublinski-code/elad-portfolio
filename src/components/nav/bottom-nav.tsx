"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";

const ACTIVE_WIDTH = 280;
const INACTIVE_WIDTH = 142;
const GAP = 8;
const PAD = 24;

function getItemWidth(index: number, activeIndex: number) {
  return index === activeIndex ? ACTIVE_WIDTH : INACTIVE_WIDTH;
}

function getItemCenter(index: number, activeIndex: number) {
  let x = PAD;
  for (let i = 0; i < index; i++) {
    x += getItemWidth(i, activeIndex) + GAP;
  }
  return x + getItemWidth(index, activeIndex) / 2;
}

function getTotalWidth(activeIndex: number) {
  let w = PAD * 2 + (sections.length - 1) * GAP;
  for (let i = 0; i < sections.length; i++) {
    w += getItemWidth(i, activeIndex);
  }
  return w;
}

export default function BottomNav() {
  const { activeId, progress, setActiveId, isInnerPage, isTransitioning } =
    useActiveSection();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);

  const computeTranslate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const vw = container.clientWidth;
    const activeIndex = sections.findIndex((s) => s.id === activeId);
    if (activeIndex < 0) return;

    const center = getItemCenter(activeIndex, activeIndex);
    const target = center - vw / 2;
    const total = getTotalWidth(activeIndex);
    const maxTx = Math.max(0, total - vw);

    setTx(-Math.max(0, Math.min(target, maxTx)));
  }, [activeId]);

  useEffect(() => {
    computeTranslate();
  }, [activeId, computeTranslate]);

  useEffect(() => {
    window.addEventListener("resize", computeTranslate);
    return () => window.removeEventListener("resize", computeTranslate);
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

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      style={{ background: "var(--cream)" }}
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{
          paddingTop: 24,
          paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="flex"
          style={{
            gap: GAP,
            paddingLeft: PAD,
            paddingRight: PAD,
            transform: `translateX(${tx}px)`,
            transition: isTransitioning
              ? "none"
              : "transform 250ms cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform",
          }}
        >
          {sections.map((s, i) => {
            const isActive = i === activeIndex;
            const isHome = s.id === "hi";
            const width = isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] px-[16px] py-[16px] text-left"
                style={{
                  width,
                  background: isActive ? s.selectedBg : "var(--white)",
                  transition: isTransitioning
                    ? "none"
                    : "width 250ms cubic-bezier(0.32, 0.72, 0, 1), background 250ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
              >
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
                    transition: "color 200ms ease",
                  }}
                >
                  {isHome ? `--- ${s.label}` : `/${s.label}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
