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
      className="flex flex-col gap-[24px]"
    >
      {/* Header card */}
      <div
        className="flex flex-col items-start justify-end rounded-[24px] p-[24px] md:p-[48px]"
        style={{
          background: "var(--black)",
          minHeight: "clamp(280px, 36vw, 520px)",
        }}
      >
        <p className="heading-display w-full" style={{ color: "var(--cream)" }}>
          Work
        </p>
      </div>

      {/* Projects group */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            ## Projects
          </p>
          <div className="flex flex-col gap-[16px]">
            {projects.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Case Studies group */}
      {caseStudies.length > 0 && (
        <div className="flex flex-col gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "rgba(0, 0, 0, 0.5)" }}
          >
            ## Case Studies
          </p>
          <div className="flex flex-col gap-[16px]">
            {caseStudies.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
