const blocks: string[] = [
  "12+ years designing digital products across the creator economy, fintech, and gaming. Most recently at StreamElements, where I led design across a complex multi-sided platform: sponsorships marketplace, CRM, data platform, and B2C engagement tools for streamers.",
  "My background is broad by design. B2B and B2C, from 0-to-1 founding roles to scaling design teams, from consumer interfaces to enterprise workflows. What stays consistent is how I approach problems: start with the user, define success for a real person, align with a business goal, then build.",
  "The last couple of years I\u2019ve been building with AI, prototyping and shipping with tools like Claude Code and Cursor. The quality of what AI produces is a reflection of how clearly you understood the problem going in. That\u2019s where the design thinking still lives.",
];

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col overflow-hidden rounded-none md:rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header */}
      <div className="px-[24px] pt-[24px] md:px-[48px] md:pt-[24px]">
        <p className="heading-display w-full" style={{ color: "var(--cream)" }}>
          About
        </p>
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="mt-[16px] h-px w-full shrink-0"
        style={{ background: "rgba(255,255,255,0.2)" }}
      />

      {/* Content */}
      <div className="flex flex-col gap-[24px] px-[24px] pt-[16px] pb-[24px] md:px-[48px] md:pt-[24px] md:pb-[48px]">
        {blocks.map((text, i) => (
          <div key={i}>
            {/* Desktop/tablet: horizontal row */}
            <div className="hidden md:flex items-start gap-[24px]">
              <span
                className="font-mono font-light shrink-0 whitespace-nowrap"
                style={{
                  fontSize: "24px",
                  color: "var(--cherry)",
                  lineHeight: "1.5",
                }}
                aria-hidden="true"
              >
                **
              </span>
              <p
                className="flex-1 font-sans font-normal leading-normal"
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.9)",
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
                  color: "var(--cherry)",
                  lineHeight: "1",
                }}
                aria-hidden="true"
              >
                **
              </span>
              <p
                className="font-sans font-normal leading-normal"
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
