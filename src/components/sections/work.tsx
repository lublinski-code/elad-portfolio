import { getAllWorkMeta } from "@/lib/content";
import WorkCard from "@/components/work/work-card";
import ExternalLinkButton from "@/components/work/external-link-button";

export default async function Work() {
  const items = await getAllWorkMeta();

  const projects = items.filter(
    (w) => w.category === "Side Project" || w.category === "Personal",
  );
  const caseStudies = items.filter((w) => w.category === "Case Study");

  return (
    <section
      id="work"
      className="flex flex-col overflow-hidden rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header */}
      <div className="px-[24px] pt-[24px] pb-[48px] md:px-[48px] md:pt-[48px] md:pb-[48px]">
        <p className="heading-display w-full" style={{ color: "var(--cream)" }}>
          Work
        </p>
      </div>

      {/* Projects group */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[24px] py-[24px] md:gap-[24px] md:px-[48px] md:py-[48px] lg:gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "var(--cherry)" }}
          >
            Projects
          </p>
          <div className="flex flex-col gap-[8px] md:gap-[16px] lg:gap-[24px]">
            {projects.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Case Studies group */}
      {caseStudies.length > 0 && (
        <div className="flex flex-col gap-[8px] px-[24px] py-[24px] md:gap-[24px] md:px-[48px] md:py-[48px] lg:gap-[16px]">
          <p
            className="font-mono text-[24px] font-light italic md:text-[32px]"
            style={{ color: "var(--cherry)" }}
          >
            Case Studies
          </p>
          <div className="flex flex-col gap-[8px] md:gap-[16px] lg:gap-[24px]">
            {caseStudies.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Other Design Samples */}
      <div className="px-[24px] py-[24px] md:px-[48px] md:py-[48px]">
        <ExternalLinkButton
          link={{
            label: "Other Design Samples",
            href: "https://www.figma.com/design/FUSzi9vPrN1Nhf3RrarNJD/Elad-Lublinski---UI-and-Design-Samples?node-id=2-38938&t=pmuXYb6gcmehgyqc-1",
          }}
          accent="var(--cherry)"
        />
      </div>
    </section>
  );
}

