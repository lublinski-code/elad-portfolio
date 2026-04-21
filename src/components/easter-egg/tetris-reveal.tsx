"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TetrisGame from "./tetris-game";

const THRESHOLD = 280;
const DECAY_RATE = 0.88;
const STORAGE_KEY = "tetris-discovered";

export default function TetrisReveal() {
  const [revealed, setRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [hasDiscovered, setHasDiscovered] = useState(false);
  const [debug, setDebug] = useState<string>("init");
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const completedRef = useRef(false);
  const decayRaf = useRef<number>(0);
  const isAtBottom = useRef(false);
  const startFillRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setHasDiscovered(true);
    }
  }, []);

  const updateVisuals = useCallback(() => {
    const p = Math.min(progressRef.current / THRESHOLD, 1);
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (labelRef.current) labelRef.current.style.opacity = String(0.4 + p * 0.6);
    if (zoneRef.current) zoneRef.current.style.transform = `translateY(${-p * 4}px)`;
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setRevealing(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setHasDiscovered(true);
    setTimeout(() => {
      setRevealed(true);
      setRevealing(false);
    }, 200);
  }, []);

  const addProgress = useCallback(
    (delta: number) => {
      if (completedRef.current) return;
      progressRef.current = Math.max(0, progressRef.current + delta);
      if (progressRef.current >= THRESHOLD) {
        progressRef.current = THRESHOLD;
        updateVisuals();
        complete();
        return;
      }
      updateVisuals();
    },
    [complete, updateVisuals],
  );

  const startDecay = useCallback(() => {
    cancelAnimationFrame(decayRaf.current);
    const tick = () => {
      if (completedRef.current) return;
      if (progressRef.current <= 0.5) {
        progressRef.current = 0;
        updateVisuals();
        return;
      }
      progressRef.current *= DECAY_RATE;
      updateVisuals();
      decayRaf.current = requestAnimationFrame(tick);
    };
    decayRaf.current = requestAnimationFrame(tick);
  }, [updateVisuals]);

  const checkAtBottom = useCallback(() => {
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    isAtBottom.current = scrollBottom >= docHeight - 2;
  }, []);

  useEffect(() => {
    if (revealed) return;
    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (isCoarse) {
      // Mobile: fill the bar when the zone enters the viewport.
      // IntersectionObserver is immune to URL-bar changes, scrollHeight
      // oddities, and fires reliably on both scroll and layout shifts.
      const FILL_MS = 900;
      let filling = false;
      let fillStart = 0;
      let fillRaf = 0;

      const stopFill = () => {
        if (!filling) return;
        filling = false;
        cancelAnimationFrame(fillRaf);
        if (progressRef.current > 0 && !completedRef.current) startDecay();
      };

      const startFill = () => {
        if (filling || completedRef.current) return;
        cancelAnimationFrame(decayRaf.current);
        filling = true;
        const resume = (progressRef.current / THRESHOLD) * FILL_MS;
        fillStart = performance.now() - resume;
        const tick = (now: number) => {
          if (!filling || completedRef.current) return;
          const elapsed = now - fillStart;
          progressRef.current = Math.min((elapsed / FILL_MS) * THRESHOLD, THRESHOLD);
          updateVisuals();
          if (progressRef.current >= THRESHOLD) {
            complete();
            return;
          }
          fillRaf = requestAnimationFrame(tick);
        };
        fillRaf = requestAnimationFrame(tick);
      };

      // Expose startFill so the tap-to-fill fallback can call it.
      startFillRef.current = startFill;

      const zone = zoneRef.current;
      if (!zone) return;

      // Fire when any part of the zone is visible. Start fill once >= 30%
      // of the zone is on screen; stop fill if it leaves entirely.
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          const ratio = entry.intersectionRatio;
          setDebug(
            `io ratio=${ratio.toFixed(2)} vis=${entry.isIntersecting ? "y" : "n"} fill=${filling ? "y" : "n"}`,
          );
          if (completedRef.current) return;
          if (entry.isIntersecting && ratio >= 0.3) {
            startFill();
          } else if (!entry.isIntersecting) {
            stopFill();
          }
        },
        {
          threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
        },
      );
      observer.observe(zone);

      // Belt-and-suspenders: also listen for scroll+scrollend, reading
      // the zone's bounding rect directly. Handles edge cases where the
      // IntersectionObserver callback is delayed by layout churn.
      const checkByRect = () => {
        if (completedRef.current || !zoneRef.current) return;
        const rect = zoneRef.current.getBoundingClientRect();
        const vh =
          window.visualViewport?.height ?? window.innerHeight;
        // Visible ratio of zone within viewport.
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(vh, rect.bottom);
        const visible = Math.max(0, visibleBottom - visibleTop);
        const ratio = rect.height > 0 ? visible / rect.height : 0;
        setDebug(
          `rect top=${Math.round(rect.top)} vh=${Math.round(vh)} ratio=${ratio.toFixed(2)} fill=${filling ? "y" : "n"}`,
        );
        if (ratio >= 0.3) startFill();
      };

      window.addEventListener("scroll", checkByRect, { passive: true });
      window.addEventListener("scrollend", checkByRect, { passive: true });
      window.addEventListener("resize", checkByRect, { passive: true });
      window.visualViewport?.addEventListener("resize", checkByRect);
      window.visualViewport?.addEventListener("scroll", checkByRect);
      const initRaf = requestAnimationFrame(checkByRect);

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", checkByRect);
        window.removeEventListener("scrollend", checkByRect);
        window.removeEventListener("resize", checkByRect);
        window.visualViewport?.removeEventListener("resize", checkByRect);
        window.visualViewport?.removeEventListener("scroll", checkByRect);
        cancelAnimationFrame(initRaf);
        cancelAnimationFrame(fillRaf);
        cancelAnimationFrame(decayRaf.current);
        startFillRef.current = null;
      };
    }

    // Desktop: wheel / trackpad pull-release
    let decayTimeout: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      checkAtBottom();
      if (!isAtBottom.current || e.deltaY <= 0) {
        if (e.deltaY < 0 && progressRef.current > 0) {
          progressRef.current = 0;
          updateVisuals();
          cancelAnimationFrame(decayRaf.current);
        }
        return;
      }
      addProgress(e.deltaY * 0.3);
      clearTimeout(decayTimeout);
      cancelAnimationFrame(decayRaf.current);
      decayTimeout = setTimeout(startDecay, 200);
    };

    const onScroll = () => checkAtBottom();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(decayRaf.current);
      clearTimeout(decayTimeout);
    };
  }, [revealed, addProgress, checkAtBottom, complete, startDecay, updateVisuals]);

  if (revealed) {
    return (
      <section
        id="tetris-egg"
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          paddingBottom: "48px",
          animation: "fadeIn 200ms ease both",
        }}
      >
        <TetrisGame />
      </section>
    );
  }

  return (
    <div
      className="mb-[88px] md:mb-0"
      style={{
        marginTop: "32px",
        opacity: revealing ? 0 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      <div
        ref={zoneRef}
        onPointerDown={() => {
          // Tap fallback: kicks off the same fill animation as the
          // scroll-based trigger. Preserves the visual ceremony.
          if (completedRef.current) return;
          startFillRef.current?.();
          setDebug((d) => `tap | ${d}`);
        }}
        style={{
          position: "relative",
          height: 120,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 24,
          background: "rgba(0,0,0,0.04)",
          overflow: "hidden",
          willChange: "transform",
          touchAction: "manipulation",
          cursor: "pointer",
        }}
      >
        <div
          ref={barRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--cherry)",
            opacity: 0.18,
            transformOrigin: "left center",
            transform: "scaleX(0)",
            transition: "transform 80ms cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform",
          }}
        />
        <span
          ref={labelRef}
          style={{
            position: "relative",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "clamp(14px, 1.5vw, 18px)",
            color: "rgba(0,0,0,0.5)",
            opacity: 0.4,
            transition: "opacity 150ms ease",
            letterSpacing: "0.02em",
          }}
        >
          {hasDiscovered ? "Scroll to play again" : "Don\u2019t scroll any further!"}
        </span>
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            marginTop: 4,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            color: "rgba(0,0,0,0.35)",
            letterSpacing: "0.02em",
            pointerEvents: "none",
          }}
        >
          {debug}
        </span>
      </div>
    </div>
  );
}
