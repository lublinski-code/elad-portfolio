type PhilosophyPoint = {
  n: string;
  text: string;
};

const points: PhilosophyPoint[] = [
  {
    n: "01",
    text: "The how is easy. The what and the who are the real work.",
  },
  {
    n: "02",
    text: "Start with a person. End with a business outcome. Everything in between is design.",
  },
  {
    n: "03",
    text: "AI amplifies clarity. If you don\u2019t know what you\u2019re solving, it won\u2019t save you.",
  },
  {
    n: "04",
    text: "Breadth is the strategy. Twelve years across creator economy, fintech, and gaming taught me that the best patterns transfer sideways.",
  },
];

const LINE_HEIGHT = 1.5;

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="flex flex-col gap-[24px]"
    >
      {/* Header card */}
      <div
        className="flex flex-col items-start justify-end rounded-none md:rounded-[24px] p-[24px] md:p-[48px]"
        style={{
          background: "var(--grape)",
          minHeight: "clamp(280px, 36vw, 520px)",
        }}
      >
        <h2
          className="heading-display w-full"
          style={{ color: "var(--cream)" }}
        >
          Philosophy
        </h2>
      </div>

      {/* Content card */}
      <div
        className="flex flex-col rounded-none md:rounded-[24px]"
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(0,0,0,0.5)",
          padding: "clamp(24px, 4vw, 48px)",
          gap: "clamp(32px, 5vw, 48px)",
        }}
      >
        {points.map((point) => (
          <div
            key={point.n}
            style={{
              fontSize: "clamp(28px, 5.5vw, 100vw)",
              lineHeight: LINE_HEIGHT,
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent 0,
                transparent calc(${LINE_HEIGHT}em - 1px),
                rgba(0, 0, 0, 0.12) calc(${LINE_HEIGHT}em - 1px),
                rgba(0, 0, 0, 0.12) ${LINE_HEIGHT}em
              )`,
              backgroundClip: "content-box",
              paddingBottom: `${LINE_HEIGHT - 1}em`,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontWeight: 100,
                color: "var(--grape)",
              }}
              aria-hidden="true"
            >
              {point.n}
            </span>{" "}
            <span
              className="font-sans"
              style={{
                fontWeight: 400,
                color: "rgba(0,0,0,0.7)",
              }}
            >
              {point.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
