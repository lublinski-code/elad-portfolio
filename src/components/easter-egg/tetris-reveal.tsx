"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TetrisGame from "./tetris-game";

const THRESHOLD = 280;
const DECAY_RATE = 0.88;
const STORAGE_KEY = "tetris-discovered";

export default function TetrisReveal() {
  const [revealed, setRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const completedRef = useRef(false);
  const decayRaf = useRef<number>(0);
  const touchStartY = useRef(0);
  const isAtBottom = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setRevealed(true);
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

    const onTouchStart = (e: TouchEvent) => {
      checkAtBottom();
      if (!isAtBottom.current) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      checkAtBottom();
      if (!isAtBottom.current) return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (deltaY <= 0) {
        if (progressRef.current > 0) {
          progressRef.current = 0;
          updateVisuals();
        }
        return;
      }
      addProgress(deltaY * 0.15);
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      if (progressRef.current > 0 && !completedRef.current) startDecay();
    };

    const onScroll = () => checkAtBottom();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(decayRaf.current);
      clearTimeout(decayTimeout);
    };
  }, [revealed, addProgress, checkAtBottom, startDecay, updateVisuals]);

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
      style={{
        marginTop: "32px",
        opacity: revealing ? 0 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      <div
        ref={zoneRef}
        style={{
          position: "relative",
          height: 120,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 24,
          background: "rgba(0,0,0,0.04)",
          overflow: "hidden",
          willChange: "transform",
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
          Don&apos;t scroll any further!
        </span>
      </div>
    </div>
  );
}
