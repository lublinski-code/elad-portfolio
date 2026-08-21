// One reading column, top to bottom. The narrative makes the argument, the two
// signposted offers say who it's for, and the close carries the credentials.
// Earlier versions broke this into a rule, a mono credential row and a
// two-column split — four visual treatments in one section, which read as
// scattered rather than structured.
const narrative: string[] = [
  "AI made building cheap. Any team can ship something now. Fewer teams are still checking whether it's the right something, because the part of the process that used to force that check, prototyping, testing, iterating, was also the slowest part.",
  "I spent the last stretch of my career rebuilding that part for myself: an AI-assisted workflow, tuned to how I personally think through a problem, that takes an idea from hypothesis to something a real user can test in days, not weeks. I used it to build a full design system in 5 weeks that would normally take 3-4 months.",
  "It's not a template, and it can't be. The questions I ask, the assumptions I make, the taste I bring to a solution, are mine. What's repeatable is the discipline of building a workflow around a specific person's judgment instead of trying to replace it. That's what I now do for other teams.",
];

// Marked with the cherry "/" used in the hero and the Experience role lists.
const help: { lead: string; text: string }[] = [
  {
    lead: "Starting from nothing",
    text: "If you're a startup with nothing but an idea and whatever came out of a Claude prompt, I build the design system, the AI-fluent workflow, and the product methodology your team will actually run on.",
  },
  {
    lead: "Already running, but ad hoc",
    text: "If you already have a product and a team but decisions are ad hoc, I bring the same infrastructure to what you've already got, and tie what your users need to what the business needs.",
  },
];

// Credentials land at the close, as proof of the claim just made, rather than
// interrupting the handoff from the argument to the offer.
const closing =
  "A decade of product design leadership across B2B and B2C SaaS, creator economy, fintech and gaming, most recently as founding Product Design Lead building a company's design org from zero. I take this on fractionally, as an embedded Head of Product Design, or full-time as a Product Design Lead where it becomes the team's standard.";

// Full card width, so the measure runs long — the extra leading keeps the eye
// from losing its place on the return sweep.
const BODY = {
  fontSize: "16px",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.7)",
} as const;


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
        <h2 className="heading-section w-full" style={{ color: "var(--cream)" }}>
          About
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-[40px] px-[24px] pb-[24px] md:px-[48px] md:pb-[48px]">
        <div className="flex flex-col gap-[24px]">
          {narrative.map((para, i) => (
            <p key={i} className="font-sans font-normal" style={BODY}>
              {para}
            </p>
          ))}
        </div>

        {/* The offer, given its own surface. It's the selling point of the
            section, so it sits slightly lifted off the charcoal rather than
            running on as another paragraph. */}
        <div
          className="flex flex-col gap-[24px] rounded-[16px] p-[24px] md:p-[32px]"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <p
            className="font-sans font-medium"
            style={{
              fontSize: "clamp(22px, 2.2vw, 28px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--cream)",
            }}
          >
            How I can help
          </p>

          {/* Side by side only from lg — below that each column would fall to
              roughly 25 characters a line, which is worse than stacking. */}
          <div className="flex flex-col gap-[32px] lg:flex-row lg:gap-[48px]">
            {help.map(({ lead, text }) => (
              <div
                key={lead}
                className="flex flex-1 flex-col gap-[8px] pl-[16px]"
                style={{ borderLeft: "2px solid var(--cherry)" }}
              >
                <span
                  className="font-mono font-normal"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.4,
                    color: "var(--cherry)",
                  }}
                >
                  / {lead}
                </span>
                <p
                  className="font-sans font-normal"
                  style={{
                    fontSize: "18px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-sans font-normal" style={BODY}>
          {closing}
        </p>
      </div>
    </section>
  );
}
