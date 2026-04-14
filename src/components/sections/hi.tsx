import SectionShell from "./section-shell";
import { getSection } from "@/components/nav/sections";

export default function Hi() {
  const section = getSection("hi");

  return (
    <SectionShell section={section}>
      {/* ── Mobile layout (< md) ──────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-[16px] py-[24px] md:hidden"
        aria-label="Hi, I'm Elad — A Product Designer / AI Builder"
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
            Designer
          </p>
        </Row>
        <HiDivider />
        <Row mobile>
          <p className="heading-display" style={{ color: "var(--cream)" }}>
            / AI Builder
          </p>
        </Row>
        <HiDivider />
        <Row mobile>
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
        </Row>
      </div>

      {/* ── Tablet + Desktop layout (md+) ─────────────────────────────────── */}
      <div
        className="hidden flex-col gap-[16px] py-[48px] md:flex"
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

        {/* Row 2: tagline (lg+) + "A Product" */}
        <Row>
          <p
            className="hidden flex-1 min-w-0 lg:block"
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
            Designer
          </p>
          <Spacer />
        </Row>

        <HiDivider />

        {/* Row 4: right-aligned */}
        <Row>
          <Spacer />
          <p className="heading-display text-right" style={{ color: "var(--cream)" }}>
            / AI Builder
          </p>
        </Row>

        {/* Tagline — shown below headings when not enough width (md–lg) */}
        <div className="lg:hidden">
          <HiDivider />
          <div className="px-[48px] pt-[16px]">
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "18px",
                lineHeight: 1.69,
                color: "#ffffff",
              }}
            >
              An AI-informed human who believes the how is easy, but the what and
              the who are the real work.
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
