"use client";

import { useEffect, useState } from "react";
import type { WorkMeta } from "@/lib/content";

type Props = {
  work: WorkMeta;
  pastel: string;
};

type MetaRow = { label: string; value: string | string[]; type?: "tags" };

const CARD_WIDTH = "clamp(200px, 20vw, 320px)";
const TRANSITION = "max-width 400ms cubic-bezier(0.32, 0.72, 0, 1), margin-left 400ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms cubic-bezier(0.32, 0.72, 0, 1)";

export default function WorkMetaCard({ work, pastel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("work-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const rows: MetaRow[] = [
    { label: "Category", value: work.category },
    { label: "Goals", value: work.tags, type: "tags" },
    ...(work.role ? [{ label: "Role", value: work.role }] : []),
    ...(work.team ? [{ label: "Team", value: work.team }] : []),
    ...(work.impact ? [{ label: "Impact", value: work.impact }] : []),
    ...(work.timeline ? [{ label: "Timeline", value: work.timeline }] : []),
  ];

  return (
    <div
      className="hidden lg:block sticky top-[48px] self-start"
      style={{
        flexShrink: 0,
        overflow: "hidden",
        maxWidth: visible ? CARD_WIDTH : "0px",
        marginLeft: visible ? "16px" : "0px",
        opacity: visible ? 1 : 0,
        transition: TRANSITION,
      }}
    >
      <div
        className="rounded-[24px] p-[24px]"
        style={{
          width: CARD_WIDTH,
          minWidth: CARD_WIDTH,
          background: "var(--coal)",
        }}
      >
        <div className="flex flex-col gap-[16px]">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-[4px]">
              <span
                className="font-sans"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {row.label}
              </span>
              {row.type === "tags" && Array.isArray(row.value) ? (
                <div className="flex flex-wrap gap-[4px]">
                  {row.value.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-[4px] px-[8px] py-[2px]"
                      style={{
                        fontSize: 13,
                        background: pastel,
                        color: "rgba(0,0,0,0.7)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span
                  className="font-sans"
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.4,
                  }}
                >
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
