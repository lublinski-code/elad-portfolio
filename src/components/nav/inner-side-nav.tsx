"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useActiveSection } from "./active-section-context";
import "./side-nav.css";

const ACCENT_HEX: Record<string, string> = {
  grape: "#6b2ed6",
  lime: "#399946",
  sunflower: "#f5c015",
  sky: "#507dff",
  mint: "#00d8ad",
  candy: "#e800a7",
  lemon: "#54e100",
};

const LIGHT_ACCENTS = new Set<string>(["lemon", "sunflower", "mint", "candy"]);

// Same constants as main side nav
const PILL_HEIGHT = 300;
const PILL_CONTENT = 73;
const NOTCH_H = 40;
const NOTCH_RIGHT = 16;
const NOTCH_TOP_MIN = 16;
const NOTCH_BOTTOM_MIN = 16;
const NOTCH_TRAVEL = PILL_HEIGHT - NOTCH_H - NOTCH_TOP_MIN - NOTCH_BOTTOM_MIN;

// Notch squeeze — same as main nav
const MAX_SQUEEZE = 3;
const PULL_SPEED = 0.025;
const SPRING_DAMPING = 0.55;

// Lerp factor — same as main nav
const LERP = 0.12;

type WorkItem = { slug: string; navLabel: string; bg: string };
type Props = { items: WorkItem[] };

export default function InnerSideNav({ items }: Props) {
  const pathname = usePathname();
  const { progress, isTransitioning } = useActiveSection();

  const progressRef = useRef(progress);
  progressRef.current = progress;

  const activeSlug = pathname.startsWith("/work/")
    ? pathname.slice("/work/".length).split("/")[0]
    : null;

  // Local selected state for click animation before navigation
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSelectedSlug(null);
    return () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); };
  }, [pathname]);

  const handleClick = (slug: string) => {
    if (slug === activeSlug) return;
    setSelectedSlug(slug);
    navTimerRef.current = setTimeout(() => {
      window.location.href = `/work/${slug}`;
    }, 300);
  };

  // Smooth notch via lerp — same as main nav
  const lerpedProgress = useRef(progress);
  const lerpRaf = useRef(0);
  const notchRef = useRef<HTMLSpanElement | null>(null);

  const applyNotchPosition = (p: number) => {
    const el = notchRef.current;
    if (!el) return;
    el.style.top = `${NOTCH_TOP_MIN + p * NOTCH_TRAVEL}px`;
  };

  useEffect(() => {
    const tick = () => {
      const target = progressRef.current;
      const current = lerpedProgress.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.001) {
        lerpedProgress.current = target;
      } else {
        lerpedProgress.current += diff * LERP;
      }
      applyNotchPosition(lerpedProgress.current);
      lerpRaf.current = requestAnimationFrame(tick);
    };

    lerpRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(lerpRaf.current);
  }, [activeSlug]);

  // Squeeze — same as main nav
  const topPull = useRef(0);
  const bottomPull = useRef(0);
  const decayRaf = useRef(0);

  const applyPull = () => {
    const el = notchRef.current;
    if (!el) return;
    const tp = topPull.current;
    const bp = bottomPull.current;
    const baseTop = NOTCH_TOP_MIN + lerpedProgress.current * NOTCH_TRAVEL;

    if (bp > 0) {
      el.style.height = `${NOTCH_H - bp}px`;
      el.style.top = `${baseTop + bp}px`;
    } else if (tp > 0) {
      el.style.height = `${NOTCH_H - tp}px`;
      el.style.top = `${baseTop}px`;
    } else {
      el.style.height = `${NOTCH_H}px`;
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

  return (
    <nav
      aria-label="Work projects"
      className={`fixed left-0 top-0 z-30 hidden h-dvh md:flex md:flex-col${isTransitioning ? " nav-no-transition" : ""}`}
      style={{ width: 208 }}
    >
      <div
        className="no-scrollbar flex w-full flex-1 flex-col gap-[8px] overflow-y-auto"
        style={{ padding: "24px 16px 24px 24px" }}
      >
        {/* Back pill */}
        <a
          href="/#work"
          className="nav-pill flex shrink-0 flex-col items-start rounded-[24px] text-left"
          style={{ "--pill-bg": "#000000", width: 168, padding: 16, gap: 8 } as React.CSSProperties}
        >
          <span className="font-mono text-[11px] font-medium leading-normal" style={{ color: "rgba(255,255,255,0.5)" }}>
            {"<--- back"}
          </span>
          <span className="font-mono text-[14px] font-normal leading-normal" style={{ color: "rgba(255,255,255,0.7)" }}>
            Work
          </span>
        </a>

        {/* Project pills */}
        {items.map((item) => {
          const accentBg = ACCENT_HEX[item.bg] ?? "#6b2ed6";
          const isActive = item.slug === activeSlug || item.slug === selectedSlug;
          const isCollapsing = item.slug === activeSlug && selectedSlug !== null && selectedSlug !== activeSlug;
          const showExpanded = isActive && !isCollapsing;
          const isLight = showExpanded && LIGHT_ACCENTS.has(item.bg);

          const textMute = showExpanded
            ? isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)"
            : "rgba(255,255,255,0.7)";
          const textStrong = showExpanded
            ? isLight ? "#000000" : "#ffffff"
            : "#ffffff";

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleClick(item.slug)}
              aria-current={item.slug === activeSlug ? "page" : undefined}
              className="nav-pill group relative flex shrink-0 flex-col items-start overflow-hidden rounded-[24px] text-left"
              style={{
                "--pill-bg": showExpanded ? accentBg : "var(--coal)",
                "--pill-spacer": showExpanded ? `${PILL_HEIGHT - PILL_CONTENT}px` : "0px",
                width: 168,
                padding: showExpanded ? "16px 32px 16px 16px" : "16px",
                gap: 8,
              } as React.CSSProperties}
            >
              <div className="nav-pill-spacer" />

              <span
                ref={item.slug === activeSlug ? notchRef : undefined}
                aria-hidden="true"
                className="nav-notch pointer-events-none absolute w-[16px] rounded-[8px]"
                style={{
                  height: NOTCH_H,
                  background: "var(--charcoal)",
                  top: NOTCH_TOP_MIN,
                  right: NOTCH_RIGHT,
                  opacity: showExpanded ? 1 : 0,
                }}
              />

              <span
                className="block font-mono text-[11px] font-medium leading-normal"
                style={{ color: textMute, transition: "color 600ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                ##
              </span>

              <span
                className="block font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: textStrong,
                  transition: "color 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                /{item.navLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
