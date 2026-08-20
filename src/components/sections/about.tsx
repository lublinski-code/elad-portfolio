// The narrative runs at a readable measure; the credential line and the
// "how I can help" items are metadata and offers, so they get their own
// treatments rather than sitting inside the prose flow.
const narrative: string[] = [
  "AI made building cheap. Any team can ship something now. Fewer teams are still checking whether it's the right something, because the part of the process that used to force that check, prototyping, testing, iterating, was also the slowest part.",
  "I spent the last stretch of my career rebuilding that part for myself: an AI-assisted workflow, tuned to how I personally think through a problem, that takes an idea from hypothesis to something a real user can test in days, not weeks. I used it to build a full design system in 5 weeks that would normally take 3-4 months.",
  "It's not a template. It can't be, the questions I ask, the assumptions I make, the taste I bring to a solution, are mine. What's repeatable is the discipline of building a workflow like this around a specific person's judgment instead of trying to replace it. That's what I now help other people do.",
];

const credential =
  "Decade of product design leadership across B2B and B2C SaaS, creator economy, fintech, gaming, most recently as founding Product Design Lead building a company's design org from zero.";

// Marked with the cherry "/" used in the hero and the Experience role lists,
// rather than 01/02 — numbered lists are the reference site's loudest device.
const help: { lead: string; text: string }[] = [
  {
    lead: "Starting from nothing",
    text: "If you're a startup with nothing but an idea and what you pulled out of a Claude Design prompt, I build the design system, the AI-fluent workflow, and the product methodology your team will actually run on, from nothing.",
  },
  {
    lead: "Already running, but ad hoc",
    text: "If you already have a product and a team but decisions are ad hoc, I bring the same infrastructure to scale it. I discover what your users need and tie it to your business goals.",
  },
];

const engagement =
  "I take on this work fractionally, as an embedded Head of Product Design, or full-time as a Product Design Lead where this becomes the team's standard.";

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
        {/* Narrative — capped at a readable measure, not the full card width */}
        <div className="flex max-w-[680px] flex-col gap-[24px]">
          {narrative.map((para, i) => (
            <p
              key={i}
              className="font-sans font-normal"
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Credential line — metadata, so it reads as a data row (mono, cherry
            rule) rather than a fourth paragraph of prose. */}
        <div
          className="max-w-[680px] pt-[24px]"
          style={{ borderTop: "1px solid var(--cherry)" }}
        >
          <p
            className="font-mono font-light"
            style={{
              fontSize: "16px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {credential}
          </p>
        </div>

        {/* How I can help — the long form of the three value-prop cards. */}
        <div className="flex flex-col gap-[24px]">
          <p
            className="font-mono font-medium"
            style={{
              fontSize: "16px",
              lineHeight: 1.4,
              color: "var(--cherry)",
            }}
          >
            How I can help
          </p>

          <div className="flex flex-col gap-[24px] md:flex-row md:gap-[32px]">
            {help.map(({ lead, text }) => (
              <div key={lead} className="flex flex-1 flex-col gap-[8px]">
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
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p
            className="max-w-[680px] font-sans font-normal"
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {engagement}
          </p>
        </div>
      </div>
    </section>
  );
}
