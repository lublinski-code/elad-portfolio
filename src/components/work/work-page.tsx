import type { Work, WorkMeta } from "@/lib/content";
import { workColorVar } from "@/lib/content";
import WorkFloater from "./work-floater";

type Props = {
  work: Work;
  prev: Pick<WorkMeta, "slug" | "title"> | null;
  next: Pick<WorkMeta, "slug" | "title"> | null;
};

export default function WorkPage({ work, prev, next }: Props) {
  // Per-work saturated accent color (lemon, grape, cloud, etc.)
  const accent = workColorVar(work.bg);
  // Text on accent bg — matches fg from frontmatter
  const accentFg = work.fg === "white" ? "var(--white)" : "var(--black)";
  const accentMute =
    work.fg === "white" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  const accentAccent =
    work.fg === "white" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";
  const accentLight =
    work.fg === "white" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const accentTagText =
    work.fg === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  // Title lines: split on sentence breaks so each line goes between dividers
  // We just render the full title in one block with dividers above and below
  // matching the Figma alternating left/right layout at 108px.
  const titleWords = work.title.split(" ");
  // Split into roughly equal halves for the alternating layout
  const mid = Math.ceil(titleWords.length / 3);
  const titleLines = [
    titleWords.slice(0, mid).join(" "),
    titleWords.slice(mid, mid * 2).join(" "),
    titleWords.slice(mid * 2).join(" "),
  ].filter(Boolean);

  return (
    <article
      className="relative min-h-screen w-full"
      style={{ background: "var(--charcoal)", color: "var(--white)" }}
    >
      <WorkFloater fg="var(--white)" bg="var(--charcoal)" prev={prev} next={next} />

      <div className="flex flex-col gap-[clamp(24px,3.3vw,48px)] p-[clamp(16px,3.3vw,48px)]">
        {/* Hero card — per-work accent color */}
        <div
          className="relative flex flex-col gap-[48px] rounded-[24px] p-[48px]"
          style={{ background: accent, color: accentFg }}
        >
          {/* Subtitle at top */}
          <p
            className="font-sans font-normal leading-normal"
            style={{ fontSize: "clamp(22px, 3.3vw, 48px)", color: accentMute }}
          >
            {work.subtitle}
          </p>

          {/* Big title — alternating left/right lines with dividers */}
          <div className="flex flex-col gap-[8px]">
            {titleLines.map((line, i) => (
              <div key={i} className="flex flex-col gap-[8px]">
                <div
                  aria-hidden
                  style={{ height: "1px", background: accentMute, width: "100%" }}
                />
                <p
                  className="font-sans font-medium leading-normal capitalize"
                  style={{
                    fontSize: "clamp(48px, 7.5vw, 108px)",
                    color: accentAccent,
                    textAlign: i % 2 === 0 ? "left" : "right",
                  }}
                >
                  {line}
                </p>
              </div>
            ))}
            <div
              aria-hidden
              style={{ height: "1px", background: accentMute, width: "100%" }}
            />
          </div>

          {/* Tags + description */}
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-wrap gap-[8px] items-center">
              {/* Category tag — muted bg */}
              <span
                className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] text-[14px] font-normal leading-[1.5]"
                style={{
                  background: accentMute,
                  color: accentAccent,
                }}
              >
                {work.category}
              </span>
              {/* Other tags — light bg */}
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] text-[14px] font-normal leading-[1.5]"
                  style={{
                    background: accentLight,
                    color: accentTagText,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Description — subtitle text at reading size */}
            <p
              className="font-sans font-normal text-[24px] leading-[1.4]"
              style={{ color: accentMute }}
            >
              {work.subtitle}
            </p>
          </div>
        </div>

        {/* Body content card — cream bg */}
        <div
          className="rounded-[24px] p-[48px]"
          style={{ background: "var(--cream)" }}
        >
          <div
            className="work-body flex flex-col gap-[24px] text-[16px] leading-[1.4] max-w-[624px]"
            style={{ color: "rgba(0,0,0,0.7)" }}
            dangerouslySetInnerHTML={{ __html: work.bodyHtml }}
          />
        </div>
      </div>
    </article>
  );
}
