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
    <section id="work" className="flex flex-col gap-[16px] md:gap-[24px]">
      {/* Charcoal headline card */}
      <div
        className="rounded-[24px] py-[24px] md:py-[48px]"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="px-[48px]">
          <h2 className="heading-section w-full" style={{ color: "var(--cream)" }}>
            Work
          </h2>
        </div>
      </div>

      {/* Projects group */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-[16px]">
          <p
            className="font-mono font-light"
            style={{ color: "var(--cherry)", fontSize: "clamp(24px, 3.2vw, 40px)" }}
          >
            Projects
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
            className="font-mono font-light"
            style={{ color: "var(--cherry)", fontSize: "clamp(24px, 3.2vw, 40px)" }}
          >
            Case Studies
          </p>
          <div className="flex flex-col gap-[16px]">
            {caseStudies.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Other Design Samples */}
      <div>
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

