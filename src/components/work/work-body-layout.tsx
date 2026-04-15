import React from "react";
import type { WorkMeta } from "@/lib/content";
import { workAccentVivid, type WorkAccent } from "@/lib/content";
import ExternalLinkButton from "./external-link-button";

type Props = {
  bodyHtml: string;
  work: WorkMeta;
  pastel: string;
  heroId: string;
};

/** Split on <hr>, keep all content (including h4 overlines) intact */
function splitSections(html: string): string[] {
  return html
    .split(/<hr\s*\/?>/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Unwrap images from <p> wrappers and add <figure> with <figcaption> */
function processImages(html: string): string {
  // First: unwrap <p><img ...></p> → bare <img ...>
  let result = html.replace(
    /<p>\s*(<img\s+[^>]*>)\s*<\/p>/gi,
    "$1",
  );
  // Then: wrap <img> with alt text in <figure> with <figcaption>
  result = result.replace(
    /<img\s+([^>]*?)alt="([^"]+)"([^>]*?)>/g,
    (_match, before, alt, after) => {
      return `<figure><img ${before}alt="${alt}"${after}><figcaption class="img-caption">${alt}</figcaption></figure>`;
    },
  );
  // Strip auto-generated figcaption when a manual <p class="img-caption"> follows
  result = result.replace(
    /<figcaption class="img-caption">[^<]*<\/figcaption><\/figure>\s*\n?\s*<p class="img-caption">/g,
    `</figure>\n<p class="img-caption">`,
  );
  // Wrap remaining bare <img> (no alt or empty alt) in <figure> without caption
  result = result.replace(
    /(?<!<figure>)(<img\s+(?![^>]*alt=")[^>]*>)/g,
    "<figure>$1</figure>",
  );
  return result;
}

/** Split HTML after the first </p> so we can inject React components between paragraphs */
function splitAfterFirstParagraph(html: string): [string, string] | null {
  const idx = html.indexOf("</p>");
  if (idx === -1) return null;
  const splitAt = idx + 4; // length of "</p>"
  return [html.slice(0, splitAt), html.slice(splitAt)];
}

const bodyStyle = (pastel: string) =>
  ({ color: "rgba(0,0,0,0.7)", "--callout-bg": pastel }) as React.CSSProperties;

function GoalHighlight({ goal, secondaryGoal, businessGoal, pastel }: { goal?: string; secondaryGoal?: string; businessGoal?: string; pastel: string }) {
  if (!goal && !secondaryGoal && !businessGoal) return null;

  const renderText = (text: string) =>
    text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const cards: { label: string; text: string }[] = [];
  if (goal) cards.push({ label: "Goal", text: goal });
  if (secondaryGoal) cards.push({ label: "Secondary Goal", text: secondaryGoal });
  if (businessGoal) cards.push({ label: "Business Goal", text: businessGoal });

  return (
    <div
      className="rounded-[24px] p-[24px] md:p-[48px]"
      style={{ background: "var(--cream)" }}
    >
      <div className="flex flex-col gap-[16px]" style={{ maxWidth: 640 }}>
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[16px] p-[24px]"
            style={{ background: "rgba(0, 0, 0, 0.04)" }}
          >
            <p
              className="font-sans text-[16px] leading-[1.5]"
              style={{ color: "rgba(0,0,0,0.7)" }}
              dangerouslySetInnerHTML={{
                __html: `<strong>${card.label}:</strong> ${renderText(card.text)}`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkBodyLayout({ bodyHtml, work, pastel }: Props) {
  const sections = splitSections(bodyHtml);
  const accent = workAccentVivid(work.bg as WorkAccent) ?? "#6b2ed6";
  const links = work.links;
  const hasGoals = !!(work.goal || work.secondaryGoal || work.businessGoal);

  return (
    <>
      {sections.map((rawHtml, idx) => {
        const html = processImages(rawHtml);
        const hasLinks = idx === 0 && links && links.length > 0;
        const split = hasLinks ? splitAfterFirstParagraph(html) : null;

        if (split) {
          const [before, after] = split;
          return (
            <React.Fragment key={idx}>
              <div
                className="rounded-[24px] p-[24px] md:p-[48px]"
                style={{ background: "var(--cream)" }}
              >
                <div
                  className="work-body"
                  style={bodyStyle(pastel)}
                  dangerouslySetInnerHTML={{ __html: before }}
                />
                <div className="flex flex-wrap gap-[16px]" style={{ marginTop: 24, marginBottom: 24, maxWidth: 640 }}>
                  {links!.map((link) => (
                    <ExternalLinkButton key={link.href} link={link} accent={accent} />
                  ))}
                </div>
                <div
                  className="work-body"
                  style={bodyStyle(pastel)}
                  dangerouslySetInnerHTML={{ __html: after }}
                />
              </div>
              {idx === 0 && hasGoals && (
                <GoalHighlight goal={work.goal} secondaryGoal={work.secondaryGoal} businessGoal={work.businessGoal} pastel={pastel} />
              )}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={idx}>
            <div
              className="rounded-[24px] p-[24px] md:p-[48px]"
              style={{ background: "var(--cream)" }}
            >
              <div
                className="work-body"
                style={bodyStyle(pastel)}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
            {idx === 0 && hasGoals && (
              <GoalHighlight goal={work.goal} secondaryGoal={work.secondaryGoal} businessGoal={work.businessGoal} pastel={pastel} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
