type AboutBlock = {
  paragraphs: string[];
};

const blocks: AboutBlock[] = [
  {
    paragraphs: [
      "12+ years designing digital products across the creator economy, fintech, and gaming.",
      "Most recently at StreamElements, where I led design across a complex multi-sided platform: sponsorships marketplace, CRM, data platform, and B2C engagement tools for streamers.",
    ],
  },
  {
    paragraphs: [
      "My background is broad by design. B2B and B2C, from 0-to-1 founding roles to scaling design teams, from consumer interfaces to enterprise workflows.",
      "What stays consistent is how I approach problems: start with the user, define success for a real person, align with a business goal, then build.",
    ],
  },
  {
    paragraphs: [
      "The last couple of years I\u2019ve been building with AI, prototyping and shipping with tools like Claude Code and Cursor.",
      "The quality of what AI produces is a reflection of how clearly you understood the problem going in.",
      "That\u2019s where the design thinking still lives.",
    ],
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col gap-[24px]"
    >
      {/* Header card */}
      <div
        className="flex flex-col items-start justify-end rounded-[24px] p-[24px] md:p-[48px]"
        style={{
          background: "var(--pine)",
          minHeight: "clamp(280px, 36vw, 520px)",
        }}
      >
        <p
          className="heading-display w-full"
          style={{ color: "var(--cream)" }}
        >
          About
        </p>
      </div>

      {/* Content card */}
      <div
        className="flex flex-col rounded-[24px]"
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(0,0,0,0.5)",
          padding: "clamp(24px, 4vw, 48px)",
        }}
      >
        {blocks.map((block, blockIdx) => (
          <div key={blockIdx}>
            {/* Divider between blocks */}
            {blockIdx > 0 && (
              <div
                aria-hidden="true"
                className="w-full my-[24px]"
                style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}
              />
            )}

            <div className="flex flex-col gap-[24px]">
              {block.paragraphs.map((text, paraIdx) => (
                <div key={paraIdx}>
                  {paraIdx === 0 ? (
                    /* First paragraph: ** marker visible */
                    <>
                      {/* Desktop/tablet: horizontal row */}
                      <div className="hidden md:flex items-start gap-[24px]">
                        <span
                          className="font-mono font-light shrink-0 whitespace-nowrap"
                          style={{
                            fontSize: "clamp(18px, 1.6vw, 24px)",
                            color: "var(--pine)",
                            lineHeight: "1.5",
                          }}
                          aria-hidden="true"
                        >
                          **
                        </span>
                        <p
                          className="font-sans font-normal leading-normal"
                          style={{
                            fontSize: "clamp(18px, 1.8vw, 28px)",
                            color: "rgba(0,0,0,0.9)",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                      {/* Mobile: vertical stack */}
                      <div className="flex flex-col gap-[8px] md:hidden">
                        <span
                          className="font-mono font-light"
                          style={{
                            fontSize: "24px",
                            color: "var(--pine)",
                            lineHeight: "38px",
                          }}
                          aria-hidden="true"
                        >
                          **
                        </span>
                        <p
                          className="font-sans font-normal leading-normal"
                          style={{
                            fontSize: "14px",
                            color: "rgba(0,0,0,0.9)",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Continuation paragraphs */
                    <>
                      {/* Desktop/tablet: transparent spacer for column alignment */}
                      <div className="hidden md:flex items-start gap-[24px]">
                        <span
                          className="font-mono font-light shrink-0 whitespace-nowrap"
                          style={{
                            fontSize: "clamp(18px, 1.6vw, 24px)",
                            color: "transparent",
                            lineHeight: "1.5",
                          }}
                          aria-hidden="true"
                        >
                          **
                        </span>
                        <p
                          className="font-sans font-normal leading-normal"
                          style={{
                            fontSize: "clamp(18px, 1.8vw, 28px)",
                            color: "rgba(0,0,0,0.9)",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                      {/* Mobile: full-width, no glyph */}
                      <p
                        className="font-sans font-normal leading-normal md:hidden"
                        style={{
                          fontSize: "14px",
                          color: "rgba(0,0,0,0.9)",
                        }}
                      >
                        {text}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
