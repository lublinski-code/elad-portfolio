"use client";

import { useEffect, useRef, useCallback } from "react";

type Props = {
  nextSlug: string;
  nextTitle: string;
  accentColor: string;
};

const THRESHOLD = 280;
const DECAY_RATE = 0.88;

export default function NextPagePull({
  nextSlug,
  nextTitle,
  accentColor,
}: Props) {
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const navigatingRef = useRef(false);
  const decayRaf = useRef<number>(0);
  const touchStartY = useRef(0);
  const isAtBottom = useRef(false);

  const updateVisuals = useCallback(() => {
    const p = Math.min(progressRef.current / THRESHOLD, 1);
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${p})`;
    }
    if (labelRef.current) {
      labelRef.current.style.opacity = String(0.4 + p * 0.6);
    }
    if (zoneRef.current) {
      // Subtle lift as progress grows
      zoneRef.current.style.transform = `translateY(${-p * 4}px)`;
    }
  }, []);

  const navigate = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    // Brief pulse before navigating
    if (barRef.current) {
      barRef.current.style.transition = "opacity 200ms ease";
      barRef.current.style.opacity = "0.6";
    }

    setTimeout(() => {
      window.location.href = `/work/${nextSlug}`;
    }, 180);
  }, [nextSlug]);

  const addProgress = useCallback(
    (delta: number) => {
      if (navigatingRef.current) return;
      progressRef.current = Math.max(0, progressRef.current + delta);

      if (progressRef.current >= THRESHOLD) {
        progressRef.current = THRESHOLD;
        updateVisuals();
        navigate();
        return;
      }

      updateVisuals();
    },
    [navigate, updateVisuals],
  );

  const startDecay = useCallback(() => {
    cancelAnimationFrame(decayRaf.current);

    const tick = () => {
      if (navigatingRef.current) return;
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
    // Within 2px of bottom
    isAtBottom.current = scrollBottom >= docHeight - 2;
  }, []);

  useEffect(() => {
    // --- Wheel handler (desktop) ---
    let decayTimeout: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      checkAtBottom();
      if (!isAtBottom.current || e.deltaY <= 0) {
        // Scrolling up -- reset
        if (e.deltaY < 0 && progressRef.current > 0) {
          progressRef.current = 0;
          updateVisuals();
          cancelAnimationFrame(decayRaf.current);
        }
        return;
      }

      // At bottom, scrolling down -- accumulate
      addProgress(e.deltaY * 0.3);

      // Reset decay timer
      clearTimeout(decayTimeout);
      cancelAnimationFrame(decayRaf.current);
      decayTimeout = setTimeout(startDecay, 200);
    };

    // --- Touch handlers (mobile) ---
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
        // Pulling down (scrolling up) -- reset
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
      if (progressRef.current > 0 && !navigatingRef.current) {
        startDecay();
      }
    };

    // --- Scroll handler for bottom detection + zone opacity ---
    const onScroll = () => {
      checkAtBottom();
    };

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
  }, [addProgress, checkAtBottom, startDecay, updateVisuals]);

  return (
    <div
      ref={zoneRef}
      className="relative flex items-center justify-between rounded-[24px] overflow-hidden"
      style={{
        height: 120,
        background: "rgba(255,255,255,0.06)",
        padding: "0 24px",
        willChange: "transform",
      }}
    >
      {/* Progress bar */}
      <div
        ref={barRef}
        className="absolute inset-0"
        style={{
          background: accentColor,
          opacity: 0.18,
          transformOrigin: "left center",
          transform: "scaleX(0)",
          transition: "transform 80ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      />

      {/* Label */}
      <span
        ref={labelRef}
        className="relative font-sans font-medium"
        style={{
          fontSize: "clamp(14px, 1.5vw, 18px)",
          color: "rgba(255,255,255,0.4)",
          transition: "opacity 150ms ease",
        }}
      >
        Next: {nextTitle}
      </span>

      {/* Chevron */}
      <svg
        className="relative"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <path
          d="M7 4l6 6-6 6"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
