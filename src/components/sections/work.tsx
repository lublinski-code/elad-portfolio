import { getAllWorkMeta } from "@/lib/content";
import WorkCard from "@/components/work/work-card";

export default async function Work() {
  const items = await getAllWorkMeta();

  const projects = items.filter(
    (w) => w.category === "Side Project" || w.category === "Personal",
  );
  const caseStudies = items.filter((w) => w.category === "Case Study");

  return (
    <section
      id="work"
      className="flex flex-col overflow-hidden rounded-none md:rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header */}
      <div className="px-[24px] pt-[24px] pb-[48px] md:px-[48px] md:pt-[48px] md:pb-[48px]">
        <p className="heading-display w-full" style={{ color: "var(--cream)" }}>
          Work
        </p>
      </div>

      {/* Divider */}
      <WorkDivider />

      {/* Projects group */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[24px] py-[24px] md:gap-[24px] md:px-[48px] md:py-[48px] lg:gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "var(--cherry)" }}
          >
            ## Projects
          </p>
          <div className="flex flex-col gap-[8px] md:gap-[16px] lg:gap-[24px]">
            {projects.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <WorkDivider />

      {/* Case Studies group */}
      {caseStudies.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[24px] py-[24px] md:gap-[24px] md:px-[48px] md:py-[48px] lg:gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "var(--cherry)" }}
          >
            ## Case Studies
          </p>
          <div className="flex flex-col gap-[8px] md:gap-[16px] lg:gap-[24px]">
            {caseStudies.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** Full-width cream 1px divider */
function WorkDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full shrink-0"
      style={{ background: "rgba(255,255,255,0.2)" }}
    />
  );
}
