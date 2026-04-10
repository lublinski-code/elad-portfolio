import type { Section } from "@/components/nav/sections";

type Props = {
  section: Section;
  className?: string;
  children: React.ReactNode;
};

/**
 * Per-section card wrapper.
 * In the new floating-card architecture this element IS the card — it carries
 * the section id for scroll-tracking and exposes per-section CSS tokens to
 * all descendants.  Background, radius, and overflow are set here; internals
 * are the section's own responsibility.
 */
export default function SectionShell({ section, className = "", children }: Props) {
  return (
    <section
      id={section.id}
      className={`relative w-full overflow-hidden rounded-[24px] ${className}`}
      style={
        {
          background: section.bg,
          ["--section-bg" as string]: section.bg,
          ["--section-body" as string]: section.body,
          ["--section-display" as string]: section.display,
          ["--section-mute" as string]: section.mute,
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  );
}
