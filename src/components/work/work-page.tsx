import type { Work, WorkMeta } from "@/lib/content";
import { workAccentVivid, workAccentPastel, type WorkAccent } from "@/lib/content";
import BodyBackground from "./body-bg";
import WorkBodyLayout from "./work-body-layout";
import WorkMetaCard from "./work-meta-card";
import NextPagePull from "./next-page-pull";
import ImageLightbox from "./image-lightbox";

type Props = {
  work: Work;
  nextWork: WorkMeta | null;
};

const LIGHT_ACCENTS = new Set(["lemon", "sunflower", "mint", "candy"]);
const LINE_HEIGHT = 1.15;

export default function WorkPage({ work, nextWork }: Props) {
  const accent = workAccentVivid(work.bg as WorkAccent) ?? "#6b2ed6";
  const pastel = workAccentPastel(work.bg as WorkAccent) ?? "#dfd2f6";
  const isLight = LIGHT_ACCENTS.has(work.bg);
  const accentFg = isLight ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)";
  const accentMute = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)";
  const dividerColor = isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";
  const tagSolidBg = isLight ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)";
  const tagSolidFg = isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";
  const tagGhostBg = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)";
  const tagGhostFg = accentFg;

  return (
    <div
      className="min-h-screen animate-[pageFade_300ms_ease_both]"
      style={{ background: "var(--charcoal)" }}
    >
      <BodyBackground color="#2a2a2a" />

      <main
        className="
          p-[8px]
          pb-[calc(72px+env(safe-area-inset-bottom))]
          md:pt-[24px] md:pr-[24px] md:pb-[16px] md:pl-[8px]
          md:ml-[208px]
        "
      >
        <div className="flex flex-col gap-[8px] md:gap-[16px]">
          {/* Hero card */}
          <div
            id="work-hero"
            className="rounded-[24px]"
            style={{ background: accent }}
          >
            <div className="flex flex-col gap-[16px] py-[24px] md:py-[48px]">
              {/* Subtitle eyebrow */}
              <div className="px-[24px] md:px-[48px]">
                <p
                  className="font-sans font-normal"
                  style={{
                    fontSize: "clamp(18px, 3vw, 48px)",
                    lineHeight: 1.35,
                    color: accentFg,
                    maxWidth: "90%",
                  }}
                >
                  {work.subtitle}
                </p>
              </div>

              {/* Divider */}
              <div
                aria-hidden="true"
                className="h-px w-full shrink-0"
                style={{ background: dividerColor }}
              />

              {/* Title with coast-to-coast line dividers */}
              <div
                style={{
                  fontSize: "clamp(36px, 7.5vw, 108px)",
                  lineHeight: LINE_HEIGHT,
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    transparent 0,
                    transparent calc(${LINE_HEIGHT}em - 1px),
                    ${dividerColor} calc(${LINE_HEIGHT}em - 1px),
                    ${dividerColor} ${LINE_HEIGHT}em
                  )`,
                }}
              >
                <h1
                  className="font-sans font-medium px-[24px] md:px-[48px]"
                  style={{
                    fontSize: "inherit",
                    lineHeight: "inherit",
                    letterSpacing: "-0.02em",
                    color: accentFg,
                    paddingBottom: `${LINE_HEIGHT - 1}em`,
                    margin: 0,
                  }}
                >
                  {work.title}
                </h1>
              </div>

              {/* Tags */}
              <div className="px-[24px] md:px-[48px]">
                <div className="flex flex-wrap gap-[8px]">
                  <span
                    className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] font-normal leading-[1.5]"
                    style={{
                      fontSize: "14px",
                      background: tagSolidBg,
                      color: tagSolidFg,
                    }}
                  >
                    {work.category}
                  </span>
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-[4px] px-[8px] py-[4px] font-normal leading-[1.5]"
                      style={{
                        fontSize: "14px",
                        background: tagGhostBg,
                        color: tagGhostFg,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body: content + sticky meta card */}
          <div className="flex items-start">
            <div className="flex flex-col gap-[8px] md:gap-[16px] min-w-0 flex-1">
              <WorkBodyLayout
                bodyHtml={work.bodyHtml}
                work={work}
                pastel={pastel}
                heroId="work-hero"
              />

              {nextWork && (
                <NextPagePull
                  nextSlug={nextWork.slug}
                  nextTitle={nextWork.title}
                  accentColor={accent}
                />
              )}
            </div>

            <WorkMetaCard work={work} pastel={pastel} />
          </div>
        </div>
      </main>
      <ImageLightbox />
    </div>
  );
}
