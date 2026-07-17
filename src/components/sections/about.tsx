const sentences: string[] = [
  "Product Design Lead / Design Engineer with 12+ years of experience architecting complex B2B platforms, fintech, and design systems.",
  "I bridge the gap between engineering speed and product validation.",
  "By embedding an AI-native toolchain (Claude Code, multi-agent frameworks) directly into the design phase, I eliminate static handoff friction and compress the UI production layer.",
  "This structural velocity allows me to maintain rigorous user discovery loops, ensuring teams use technical speed to build verified products rather than just shipping unvalidated features faster.",
];

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col overflow-hidden rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header — pb matches Contact's title→divider gap so both headers are
          the same height (top edge → content start), even without a divider. */}
      <div className="px-[24px] pt-[24px] pb-[24px] md:px-[48px] md:pt-[48px] md:pb-[48px]">
        <p className="heading-section w-full" style={{ color: "var(--cream)" }}>
          About
        </p>
      </div>

      {/* Body */}
      <div className="px-[24px] pb-[24px] md:px-[48px] md:pb-[48px]">
        <p
          className="font-sans font-normal leading-normal"
          style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)" }}
        >
          {sentences.map((sentence, i) => (
            <span key={i} className="block">
              {sentence}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
