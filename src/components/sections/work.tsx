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
      className="flex flex-col overflow-hidden rounded-[24px]"
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

      {/* Divider */}
      <WorkDivider />

      {/* Other Design Samples */}
      <div className="px-[24px] py-[24px] md:px-[48px] md:py-[48px]">
        <div className="external-link-wrapper relative inline-block">
          <div
            className="absolute inset-0 rounded-[16px]"
            style={{ background: "var(--cherry)" }}
            aria-hidden="true"
          />
          <a
            href="https://www.figma.com/design/FUSzi9vPrN1Nhf3RrarNJD/Elad-Lublinski---UI-and-Design-Samples?node-id=2-38938&t=pmuXYb6gcmehgyqc-1"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link relative flex items-center gap-[16px] rounded-[16px] p-[24px]"
          >
            <span
              className="font-mono text-[18px] font-normal leading-normal md:text-[22px]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Other Design Samples
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="external-link-icon shrink-0"
              aria-hidden="true"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7v10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
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
