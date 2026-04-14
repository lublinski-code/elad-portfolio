import type { Section } from "@/components/nav/sections";

type Props = {
  section: Section;
  className?: string;
  children: React.ReactNode;
};

/**
 * Per-section card wrapper.
 * Carries the section id for scroll-tracking. Background uses the section's
 * selectedBg (the same vivid color shown on the active nav pill).
 */
export default function SectionShell({ section, className = "", children }: Props) {
  return (
    <section
      id={section.id}
      className={`relative w-full overflow-hidden rounded-none md:rounded-[24px] ${className}`}
      style={{ background: section.selectedBg }}
    >
      {children}
    </section>
  );
}
