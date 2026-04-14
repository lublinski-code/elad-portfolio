import type { WorkMeta } from "@/lib/content";

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
  // Wrap remaining bare <img> (no alt or empty alt) in <figure> without caption
  result = result.replace(
    /(?<!<figure>)(<img\s+(?![^>]*alt=")[^>]*>)/g,
    "<figure>$1</figure>",
  );
  return result;
}

export default function WorkBodyLayout({ bodyHtml, pastel }: Props) {
  const sections = splitSections(bodyHtml);

  return (
    <>
      {sections.map((rawHtml, idx) => {
        const html = processImages(rawHtml);
        return (
          <div
            key={idx}
            className="rounded-none md:rounded-[24px] p-[24px] md:p-[48px]"
            style={{ background: "var(--cream)" }}
          >
            <div
              className="work-body"
              style={{
                color: "rgba(0,0,0,0.7)",
                "--callout-bg": pastel,
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        );
      })}
    </>
  );
}
