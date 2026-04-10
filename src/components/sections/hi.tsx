import SectionShell from "./section-shell";
import { getSection } from "@/components/nav/sections";

export default function Hi() {
  const section = getSection("hi");

  return (
    <SectionShell section={section}>
      {/* ── Mobile layout (hidden on lg+) ─────────────────────────────────── */}
      <div
        className="flex flex-col gap-4 p-6 lg:hidden"
        aria-label="Hi, I'm Elad — A Product Designer / AI Builder"
      >
        <p className="heading-display" style={{ color: "#ffffff" }}>
          Hi, I&apos;m Elad
        </p>
        <HiDivider />
        <p className="heading-display text-right" style={{ color: "#ffffff" }}>
          A Product
        </p>
        <HiDivider />
        <p className="heading-display" style={{ color: "#ffffff" }}>
          Designer
        </p>
        <HiDivider />
        <p className="heading-display" style={{ color: "#ffffff" }}>
          / AI Builder
        </p>
        <HiDivider />
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "21px",
            lineHeight: 1.69,
            color: "#ffffff",
          }}
        >
          An AI-informed human who believes the how is easy, but the what and
          the who are the real work.
        </p>
      </div>

      {/* ── Desktop layout (hidden below lg) ──────────────────────────────── */}
      <div
        className="hidden flex-col items-start justify-end gap-4 p-12 lg:flex lg:gap-4 lg:p-[48px]"
        aria-hidden="true"
      >
        {/* Row 1: centered headline */}
        <div className="flex w-full items-center gap-4">
          <Spacer />
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Hi, I&apos;m Elad
          </p>
          <Spacer />
        </div>

        <HiDivider />

        {/* Row 2: body copy (flex-1) + "A Product" (shrink-0, right) */}
        <div className="flex w-full items-center gap-4">
          <p
            className="flex-1 min-w-0"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(13px, 1.25vw, 18px)",
              lineHeight: 1.69,
              color: "#ffffff",
            }}
          >
            An AI-informed human who believes the how is easy, but the what and
            the who are the real work.
          </p>
          <p
            className="heading-display shrink-0 text-right"
            style={{ color: "var(--cream)" }}
          >
            A Product
          </p>
        </div>

        <HiDivider />

        {/* Row 3: centered */}
        <div className="flex w-full items-center gap-4">
          <Spacer />
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Designer
          </p>
          <Spacer />
        </div>

        <HiDivider />

        {/* Row 4: right-aligned */}
        <div className="flex w-full items-center gap-4">
          <Spacer />
          <p className="heading-display text-right" style={{ color: "var(--cream)" }}>
            / AI Builder
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

/** Full-width 1px divider */
function HiDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full shrink-0"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    />
  );
}

/** Invisible flex spacer */
function Spacer() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-1 self-stretch"
    />
  );
}
