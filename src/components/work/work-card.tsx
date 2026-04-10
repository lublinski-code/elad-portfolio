import Link from "next/link";
import type { WorkMeta } from "@/lib/content";
import {
  workAccentVivid,
  workAccentPastel,
  type WorkAccent,
} from "@/lib/content";

import "./work-card.css";

export default function WorkCard({ work }: { work: WorkMeta }) {
  const accent = work.bg as WorkAccent;
  const vivid = workAccentVivid(accent);
  const pastel = workAccentPastel(accent);

  return (
    <div
      className="work-card-wrapper relative"
      style={
        {
          "--wc-vivid": vivid,
          "--wc-pastel": pastel,
        } as React.CSSProperties
      }
    >
      {/* Bevel — sits at resting position, revealed when card lifts */}
      <div
        className="absolute inset-0 rounded-[24px]"
        style={{ background: vivid }}
        aria-hidden="true"
      />
      <Link
        href={`/work/${work.slug}`}
        className="work-card group relative block rounded-[24px] p-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coal)]"
      >
        {/* Desktop: single row. Mobile: vertical stack */}
        <div className="flex flex-col items-start gap-[24px] md:flex-row">
          {/* ** marker — pinned to top-left */}
          <span
            className="wc-marker shrink-0 font-mono text-[32px] font-light leading-none md:w-[39px] md:text-center"
            aria-hidden="true"
          >
            **
          </span>

          {/* Content column */}
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <p className="wc-title font-normal leading-normal" style={{ fontSize: "clamp(22px, 2.2vw, 28px)" }}>
              {work.title}
            </p>
            <p className="wc-desc font-normal leading-normal" style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>
              {work.subtitle}
            </p>

            {/* Tags */}
            <div className="mt-[4px] flex flex-wrap items-center gap-[8px]">
              {/* Work type tag — pastel bg applied directly (CSS var was mangled by SSR) */}
              <span
                className="wc-type-tag inline-flex items-center rounded-[4px] px-[8px] py-[4px] text-[14px] font-normal leading-[1.5]"
                style={{ background: pastel }}
              >
                {work.category}
              </span>
              {/* Goal/impact tags */}
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="wc-goal-tag inline-flex items-center rounded-[4px] px-[8px] py-[4px] text-[14px] font-normal leading-[1.5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Spacer + arrow (desktop only, spacer hidden at mid-widths) */}
          <div className="hidden w-[310px] shrink-0 xl:block" aria-hidden="true" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="wc-arrow hidden shrink-0 self-center md:block"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
}
