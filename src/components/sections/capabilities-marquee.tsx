"use client";

import { useEffect, useRef } from "react";

const capabilities: string[] = [
  "Continuous discovery",
  "Design systems",
  "Systems thinking",
  "Product-team output, solo",
  "Claude Code",
  "Prototypes in real code",
];

// Speed is defined in pixels-per-second so longer copy doesn't scroll faster —
// duration is derived from the measured track width. Hover slows it to ~0.44x.
const PX_PER_SEC = 70;
const RATE_FAST = 1;
const RATE_SLOW = 0.44;
const EASE_MS = 400;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function CapabilitiesMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The track holds the phrase set duplicated once; translateX(-50%) advances
    // by exactly one set. duration = distance / speed keeps px/s constant.
    const halfWidth = el.scrollWidth / 2;
    const duration = (halfWidth / PX_PER_SEC) * 1000;

    const anim = el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;

    return () => {
      anim.cancel();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ramp playbackRate smoothly — preserves position, so no jump.
  const rampTo = (target: number) => {
    const anim = animRef.current;
    if (!anim) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = anim.playbackRate;
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / EASE_MS, 1);
      anim.playbackRate = from + (target - from) * easeInOut(t);
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
  };

  // Duplicated once so translateX(-50%) loops seamlessly.
  const items = [...capabilities, ...capabilities];

  return (
    <div
      className="overflow-hidden py-[8px]"
      aria-label={capabilities.join(", ")}
      onMouseEnter={() => rampTo(RATE_SLOW)}
      onMouseLeave={() => rampTo(RATE_FAST)}
    >
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap items-center"
        aria-hidden="true"
      >
        {items.map((cap, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap font-mono font-medium text-[16px] leading-[1.4] md:text-[18px]"
            style={{ color: "var(--cherry)" }}
          >
            {cap}
            <span className="px-[16px] md:px-[24px]" aria-hidden="true">
              &middot;
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
