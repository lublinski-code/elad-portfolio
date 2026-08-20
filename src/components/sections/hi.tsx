import SectionShell from "./section-shell";
import { getSection } from "@/components/nav/sections";

export default function Hi() {
  const section = getSection("hi");

  return (
    <SectionShell section={section}>
      {/* Single accessible page heading (the giant display rows are decorative) */}
      <h1 className="sr-only">
        Hi, I&apos;m Elad. A Product Design Lead / Fractional Head of Product
        Design.
      </h1>
      {/* ── Mobile layout (< md) ──────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-[24px] py-[24px] md:hidden"
        aria-label="Hi, I'm Elad. A Product Design Lead / Fractional Head of Product Design."
      >
        <Row mobile>
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Hi, I&apos;m Elad
          </p>
        </Row>
        <HiDivider />
        <Row mobile>
          <p className="heading-display text-right flex-1" style={{ color: "var(--cream)" }}>
            A Product
          </p>
        </Row>
        <HiDivider />
        <Row mobile>
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Design Lead
          </p>
        </Row>
        <HiDivider />
        <Row mobile>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(18px, 3vw, 28px)",
              lineHeight: 1.3,
              color: "#ffffff",
            }}
          >
            / Fractional Head of Product Design.
          </p>
        </Row>
      </div>

      {/* ── Tablet + Desktop layout (md+) ─────────────────────────────────── */}
      <div
        className="hero-desktop hidden flex-col gap-[32px] py-[32px] md:flex"
        aria-hidden="true"
      >
        {/* Row 1: centered headline */}
        <Row>
          <Spacer />
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Hi, I&apos;m Elad
          </p>
          <Spacer />
        </Row>

        <HiDivider />

        {/* Row 2: specialization line (lg+) + "A Product" */}
        <Row>
          <p
            className="hidden flex-1 min-w-0 lg:block"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(18px, 2vw, 38px)",
              lineHeight: 1.3,
              color: "#ffffff",
            }}
          >
            / Fractional Head of Product Design.
          </p>
          <p
            className="heading-display shrink-0 text-right lg:ml-0 ml-auto"
            style={{ color: "var(--cream)" }}
          >
            A Product
          </p>
        </Row>

        <HiDivider />

        {/* Row 3: centered */}
        <Row>
          <Spacer />
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            Design
          </p>
          <Spacer />
        </Row>

        <HiDivider />

        {/* Row 4: right-aligned, full width */}
        <Row>
          <p className="heading-display w-full text-right" style={{ color: "var(--cream)" }}>
            Lead
          </p>
        </Row>

        {/* Specialization — shown below headings when not enough width (md–lg) */}
        <div className="lg:hidden">
          <HiDivider />
          <div className="px-[48px] pt-[32px]">
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "clamp(18px, 3vw, 28px)",
                lineHeight: 1.3,
                color: "#ffffff",
              }}
            >
              / Fractional Head of Product Design.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/** Row container with horizontal padding — mobile uses 24px, md+ uses 48px */
function Row({ children, mobile }: { children: React.ReactNode; mobile?: boolean }) {
  return (
    <div
      className={`flex w-full items-center gap-[16px] ${mobile ? "px-[24px]" : "px-[48px]"}`}
    >
      {children}
    </div>
  );
}

/** Full-width cream divider — coast to coast (no padding) */
function HiDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full shrink-0"
      style={{ background: "var(--cream)" }}
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
