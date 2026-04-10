import type { Work, WorkMeta } from "@/lib/content";
import { workAccentVivid, workAccentPastel, type WorkAccent } from "@/lib/content";
import WorkFloater from "./work-floater";
import BodyBackground from "./body-bg";

type Props = {
  work: Work;
  prev: Pick<WorkMeta, "slug" | "title"> | null;
  next: Pick<WorkMeta, "slug" | "title"> | null;
};

export default function WorkPage({ work, prev, next }: Props) {
  const accent = workAccentVivid(work.bg as WorkAccent);
  const pastel = workAccentPastel(work.bg as WorkAccent);
  const isDark = work.fg === "white";
  const accentFg = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";
  const accentMute = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";

  const titleWords = work.title.split(" ");
  const mid = Math.ceil(titleWords.length / 3);
  const titleLines = [
    titleWords.slice(0, mid).join(" "),
    titleWords.slice(mid, mid * 2).join(" "),
    titleWords.slice(mid * 2).join(" "),
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen animate-[fadeIn_800ms_cubic-bezier(0.32,0.72,0,1)]"
      style={{ background: "var(--charcoal)" }}
    >
      <BodyBackground color="#2a2a2a" />
      <WorkFloater prev={prev} next={next} />

      {/* Same layout shell as main page — nav offset + padding */}
      <main
        className="
          px-[24px] pt-[8px]
          pb-[calc(24px+72px+env(safe-area-inset-bottom))]
          md:pl-[16px] md:pr-[48px] md:pt-[16px] md:pb-[48px]
          md:ml-[232px]
        "
      >
        <div className="flex flex-col gap-[24px]">
          {/* Hero card — per-work accent color */}
          <div
            className="flex flex-col justify-end rounded-[24px] p-[24px] md:p-[48px]"
            style={{
              background: accent,
              minHeight: "clamp(280px, 36vw, 520px)",
            }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-[8px] mb-[24px]">
              <span
                className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] font-normal leading-[1.5]"
                style={{
                  fontSize: "clamp(12px, 1vw, 14px)",
                  background: pastel,
                  color: "rgba(0,0,0,0.9)",
                }}
              >
                {work.category}
              </span>
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] font-normal leading-[1.5]"
                  style={{
                    fontSize: "clamp(12px, 1vw, 14px)",
                    background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
                    color: accentMute,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title lines — alternating alignment with dividers */}
            <div className="flex flex-col gap-[8px]">
              {titleLines.map((line, i) => (
                <div key={i} className="flex flex-col gap-[8px]">
                  <div
                    aria-hidden="true"
                    style={{ height: "1px", background: accentMute, width: "100%" }}
                  />
                  <p
                    className="font-sans font-medium leading-none"
                    style={{
                      fontSize: "clamp(36px, 7.5vw, 108px)",
                      color: accentFg,
                      textAlign: i % 2 === 0 ? "left" : "right",
                    }}
                  >
                    {line}
                  </p>
                </div>
              ))}
              <div
                aria-hidden="true"
                style={{ height: "1px", background: accentMute, width: "100%" }}
              />
            </div>
          </div>

          {/* Subtitle card */}
          <div
            className="rounded-[24px] p-[24px] md:p-[48px]"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p
              className="font-sans font-normal leading-normal"
              style={{
                fontSize: "clamp(20px, 2.5vw, 32px)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {work.subtitle}
            </p>
          </div>

          {/* Body content card — cream bg */}
          <div
            className="rounded-[24px] p-[24px] md:p-[48px]"
            style={{ background: "var(--cream)" }}
          >
            <div
              className="work-body"
              style={{ color: "rgba(0,0,0,0.7)" }}
              dangerouslySetInnerHTML={{ __html: work.bodyHtml }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
