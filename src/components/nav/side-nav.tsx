"use client";

import { useEffect, useRef } from "react";
import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";
import "./side-nav.css";

const PILL_HEIGHT = 300;
const PILL_CONTENT = 73;
const NOTCH_H = 40;
const NOTCH_RIGHT = 16;
const NOTCH_TOP_MIN = 16;
const NOTCH_BOTTOM_MIN = 16;
const NOTCH_TRAVEL = PILL_HEIGHT - NOTCH_H - NOTCH_TOP_MIN - NOTCH_BOTTOM_MIN;

// Notch squeeze
const MAX_SQUEEZE = 3;
const PULL_SPEED = 0.025;
const SPRING_DAMPING = 0.55;

// Lerp factor — higher = snappier, lower = smoother
const LERP = 0.12;

export default function SideNav() {
  const { activeId, progress, isInnerPage, isTransitioning, pageTitle, setActiveId } = useActiveSection();

  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Smooth notch position via lerp
  const lerpedProgress = useRef(progress);
  const lerpRaf = useRef(0);
  const notchRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const applyNotchPosition = (p: number) => {
    const activeNotch = notchRefs.current[activeId];
    if (activeNotch) {
      activeNotch.style.top = `${NOTCH_TOP_MIN + p * NOTCH_TRAVEL}px`;
    }
  };

  // Start/maintain lerp loop
  useEffect(() => {
    const tick = () => {
      const target = progressRef.current;
      const current = lerpedProgress.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.001) {
        lerpedProgress.current = target;
        applyNotchPosition(target);
        // Keep ticking to catch new targets
        lerpRaf.current = requestAnimationFrame(tick);
        return;
      }

      lerpedProgress.current += diff * LERP;
      applyNotchPosition(lerpedProgress.current);
      lerpRaf.current = requestAnimationFrame(tick);
    };

    lerpRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(lerpRaf.current);
  }, [activeId]);

  // Reset lerp when active section changes
  useEffect(() => {
    lerpedProgress.current = 0;
  }, [activeId]);

  // Squeeze refs
  const topPull = useRef(0);
  const bottomPull = useRef(0);
  const decayRaf = useRef(0);

  const firstId = sections[0].id;
  const lastId = sections[sections.length - 1].id;

  const applyPull = () => {
    const firstNotch = notchRefs.current[firstId];
    if (firstNotch) {
      const tp = topPull.current;
      firstNotch.style.height = `${NOTCH_H - tp}px`;
    }

    const lastNotch = notchRefs.current[lastId];
    if (lastNotch) {
      const bp = bottomPull.current;
      const baseTop = NOTCH_TOP_MIN + lerpedProgress.current * NOTCH_TRAVEL;
      lastNotch.style.height = `${NOTCH_H - bp}px`;
      lastNotch.style.top = `${baseTop + bp}px`;
    }
  };

  const startDecay = () => {
    cancelAnimationFrame(decayRaf.current);
    const tick = () => {
      let active = false;
      if (topPull.current > 0.1) { topPull.current *= SPRING_DAMPING; active = true; }
      else { topPull.current = 0; }
      if (bottomPull.current > 0.1) { bottomPull.current *= SPRING_DAMPING; active = true; }
      else { bottomPull.current = 0; }
      applyPull();
      if (active) decayRaf.current = requestAnimationFrame(tick);
    };
    decayRaf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    let decayTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (e.deltaY < 0 && window.scrollY <= 2) {
        topPull.current = Math.min(topPull.current + Math.abs(e.deltaY) * PULL_SPEED, MAX_SQUEEZE);
        applyPull();
        clearTimeout(decayTimeout);
        cancelAnimationFrame(decayRaf.current);
        decayTimeout = setTimeout(startDecay, 8);
      }

      if (e.deltaY > 0 && window.scrollY >= maxScroll - 2) {
        bottomPull.current = Math.min(bottomPull.current + e.deltaY * PULL_SPEED, MAX_SQUEEZE);
        applyPull();
        clearTimeout(decayTimeout);
        cancelAnimationFrame(decayRaf.current);
        decayTimeout = setTimeout(startDecay, 8);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(decayTimeout);
      cancelAnimationFrame(decayRaf.current);
    };
  }, []);

  const handleClick = (id: string) => {
    if (isInnerPage) {
      window.location.href = `/#${id}`;
      return;
    }
    setActiveId(id as typeof activeId);
    if (id === "hi") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Sections"
      className={`fixed left-0 top-0 z-30 hidden h-dvh md:flex md:flex-col${isTransitioning ? " nav-no-transition" : ""}`}
      style={{ width: 208 }}
    >
      <div
        className="no-scrollbar flex w-full flex-1 flex-col gap-[8px] overflow-y-auto"
        style={{ padding: "24px 16px 24px 24px" }}
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
              className="nav-pill group relative flex shrink-0 flex-col items-start overflow-hidden rounded-[24px] text-left"
              style={
                {
                  "--pill-bg": isActive ? s.selectedBg : "var(--white)",
                  "--pill-spacer": isActive ? `${PILL_HEIGHT - PILL_CONTENT}px` : "0px",
                  width: 168,
                  padding: isActive ? "16px 32px 16px 16px" : "16px",
                  gap: 8,
                } as React.CSSProperties
              }
            >
              <div className="nav-pill-spacer" />

              <span
                ref={(el) => { notchRefs.current[s.id] = el; }}
                aria-hidden="true"
                className="nav-notch pointer-events-none absolute w-[16px] rounded-[8px]"
                style={{
                  height: NOTCH_H,
                  background: "var(--cream)",
                  top: NOTCH_TOP_MIN,
                  right: NOTCH_RIGHT,
                  opacity: isActive ? 1 : 0,
                }}
              />

              <span
                className="block font-mono text-[11px] font-medium leading-normal"
                style={{
                  color: isActive ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  transition: "color 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {isHome ? "---" : "#"}
              </span>

              <span
                className="block font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: isActive ? "var(--white)" : "var(--black)",
                  transition: "color 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {isHome ? s.label : `/${s.label}`}
              </span>

              {s.id === "work" && isActive && pageTitle && (
                <span
                  className="block font-mono text-[11px] font-normal leading-normal"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                >
                  {pageTitle}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
