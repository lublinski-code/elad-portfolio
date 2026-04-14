"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  lines: string[];
  aligns: Array<"left" | "center" | "right">;
  color: string;
  dividerColor: string;
};

/**
 * Multi-line headline where all lines share a single font size,
 * scaled so the longest line fills the container without wrapping.
 */
export default function FitHeadline({ lines, aligns, color, dividerColor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [fontSize, setFontSize] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fit = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      const els = lineRefs.current.filter(Boolean) as HTMLParagraphElement[];
      if (els.length === 0) return;

      // Binary search for the largest size where ALL lines fit
      let lo = 16;
      let hi = 400;

      const allFit = (size: number) => {
        for (const el of els) el.style.fontSize = `${size}px`;
        for (const el of els) {
          if (el.scrollWidth > containerWidth) return false;
        }
        return true;
      };

      if (allFit(hi)) {
        setFontSize(hi);
        return;
      }

      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        if (allFit(mid)) lo = mid;
        else hi = mid;
      }

      // Apply final size to DOM directly so state matches
      for (const el of els) el.style.fontSize = `${lo}px`;
      setFontSize(lo);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [lines]);

  return (
    <div ref={containerRef} style={{ marginTop: "clamp(32px, 4vw, 64px)", overflow: "hidden" }}>
      {lines.map((line, i) => (
        <div key={i}>
          <div
            aria-hidden="true"
            className="w-full"
            style={{ height: "1px", background: dividerColor }}
          />
          <p
            ref={(el) => { lineRefs.current[i] = el; }}
            className="font-sans font-medium"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color,
              textAlign: aligns[i],
              whiteSpace: "nowrap",
              padding: "clamp(4px, 0.5vw, 8px) 0",
            }}
          >
            {line}
          </p>
        </div>
      ))}
      <div
        aria-hidden="true"
        className="w-full"
        style={{ height: "1px", background: dividerColor }}
      />
    </div>
  );
}
