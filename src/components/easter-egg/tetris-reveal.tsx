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
      // Mobile: fill the bar when the zone enters the viewport. Once
      // started, the fill always runs to completion — we don't stop on
      // un-intersect. On a Pixel-class viewport, the zone is near the
      // end of the document, so any user scroll that reaches it is
      // enough to commit. Stopping mid-fill when the zone briefly
      // leaves the viewport (URL bar changes, rubber-banding) produced
      // a dead state where the game never revealed.
      const FILL_MS = 900;
      let filling = false;
      let fillStart = 0;
      let fillRaf = 0;

      const startFill = () => {
        if (filling || completedRef.current) return;
        cancelAnimationFrame(decayRaf.current);
        filling = true;
        const resume = (progressRef.current / THRESHOLD) * FILL_MS;
        fillStart = performance.now() - resume;
        const tick = (now: number) => {
          if (completedRef.current) return;
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

      // Fire as soon as any part of the zone enters the viewport. On
      // mobile the zone sits at the bottom of a tall page, so even a
      // sliver of intersection means the user has scrolled far enough
      // to commit.
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || completedRef.current) return;
          if (entry.isIntersecting) startFill();
        },
        { threshold: 0 },
      );
      observer.observe(zone);

      return () => {
        observer.disconnect();
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
        className="mb-[88px] md:mb-0"
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
          if (completedRef.current) return;
          startFillRef.current?.();
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
      </div>
    </div>
  );
}
