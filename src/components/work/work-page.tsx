import type { Work, WorkMeta } from "@/lib/content";
import { workAccentVivid, workAccentPastel, type WorkAccent } from "@/lib/content";
import WorkFloater from "./work-floater";
import BodyBackground from "./body-bg";

type Props = {
  work: Work;
  prev: Pick<WorkMeta, "slug" | "title"> | null;
  next: Pick<WorkMeta, "slug" | "title"> | null;
};

const LINE_HEIGHT = 1.15;

export default function WorkPage({ work, prev, next }: Props) {
  const accent = workAccentVivid(work.bg as WorkAccent);
  const pastel = workAccentPastel(work.bg as WorkAccent);
  const isDark = work.fg === "white";
  const accentFg = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";
  const accentMute = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const dividerColor = isDark
    ? "rgba(255,255,255,0.25)"
    : "rgba(0,0,0,0.2)";

  return (
    <div
      className="min-h-screen animate-[pageEnter_600ms_cubic-bezier(0.32,0.72,0,1)_both]"
      style={{ background: "var(--charcoal)" }}
    >
      <BodyBackground color="#2a2a2a" />
      <WorkFloater prev={prev} next={next} />

      <main
        className="
          px-[24px] pt-[8px]
          pb-[calc(24px+72px+env(safe-area-inset-bottom))]
          md:pl-[16px] md:pr-[48px] md:pt-[16px] md:pb-[48px]
          md:ml-[232px]
        "
      >
        <div className="flex flex-col gap-[24px]">
          {/* Hero card */}
          <div
            className="flex flex-col justify-between rounded-[24px] p-[24px] md:p-[48px]"
            style={{
              background: accent,
              minHeight: "clamp(400px, 50vw, 720px)",
            }}
          >
            {/* Top: subtitle */}
            <p
              className="font-sans font-medium leading-[1.35]"
              style={{
                fontSize: "clamp(22px, 3vw, 40px)",
                color: accentFg,
                maxWidth: "90%",
              }}
            >
              {work.subtitle}
            </p>

            {/* Title with per-line dividers via repeating gradient */}
            <h1
              className="font-sans font-medium"
              style={{
                fontSize: "clamp(36px, 7.5vw, 108px)",
                lineHeight: LINE_HEIGHT,
                letterSpacing: "-0.02em",
                color: accentFg,
                marginTop: "48px",
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0,
                  transparent calc(${LINE_HEIGHT}em - 1px),
                  ${dividerColor} calc(${LINE_HEIGHT}em - 1px),
                  ${dividerColor} ${LINE_HEIGHT}em
                )`,
                backgroundClip: "content-box",
                paddingBottom: `${LINE_HEIGHT - 1}em`,
              }}
            >
              {work.title}
            </h1>

            {/* Bottom: tags */}
            <div className="flex flex-wrap gap-[8px] mt-[24px]">
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
                    background: isDark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.1)",
                    color: accentMute,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Body content card */}
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
