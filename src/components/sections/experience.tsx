"use client";

import { Fragment, useState } from "react";

type CvBullet = { label?: string; text: string };
type ExperienceEntry = {
  id: string;
  years: string;
  company: string;
  roles: string[];
  body: CvBullet[];
};

const entries: ExperienceEntry[] = [
  {
    id: "freelance",
    years: "Present",
    company: "Freelance",
    roles: ["Product Design Lead", "Consultant", "AI Expert"],
    body: [
      {
        label: "Design Systems & AI Migration:",
        text: "Audited, restructured, and migrated a legacy enterprise design system (MUI to shadcn) in 5 weeks—a cycle that traditionally spans a full quarter. Rebuilt 35 core components, stripped out architecture redundancies, and established unified design tokens.",
      },
      {
        label: "Design-to-Code Alignment:",
        text: "Configured the system for Figma Code Connect and aligned it to an AI infrastructure layer, completely eliminating the drift between design mockups and production codebases.",
      },
      {
        label: "AI Integration Consulting:",
        text: "Partnered with product design teams to audit their current execution layers, introducing practical AI-native workflows that accelerate prototyping and buy back time for continuous customer discovery.",
      },
    ],
  },
  {
    id: "streamelements",
    years: "2018-2026",
    company: "StreamElements",
    roles: [
      "Product Design Lead",
      "Senior Product Designer",
      "Founding Designer",
    ],
    body: [
      {
        label: "Platform Strategy:",
        text: "Designed the core architecture for the Sponsorships Platform, mapping distinct, complex workflows for creators, advertisers, and internal operations to ensure platform cohesion.",
      },
      {
        label: "Discovery & Delivery:",
        text: "Maintained continuous discovery and rapid experimentation cycles that drove a 2.4x increase in campaigns per creator while reducing launch times by 37%.",
      },
      {
        label: "Cross-Functional Systems:",
        text: "Built and governed the company's foundational design system to support multi-sided SaaS surfaces, drastically reducing engineering dependencies and design bottlenecks during deployment.",
      },
      {
        label: "Founding Designer (0-to-1):",
        text: "Built the entire product architecture, visual language, and DesignOps from scratch as the sole designer.",
      },
      {
        label: "Systems & Scale:",
        text: "Created the company's first design system and research loops, enabling product teams to scale rapidly from a stable foundation.",
      },
    ],
  },
  {
    id: "seeking-alpha",
    years: "2014-2017",
    company: "Seeking Alpha",
    roles: ["Senior Product Designer", "Mobile Product UI/UX Designer"],
    body: [
      {
        label: "Platform UI/UX:",
        text: "Led desktop and mobile interaction design for a high-density fintech platform tracking global financial markets.",
      },
      {
        label: "Data Visualization:",
        text: "Re-architected complex financial charts, data visualizations, and content discoverability patterns for expert users.",
      },
    ],
  },
  {
    id: "agencies",
    years: "2005-2014",
    company: "Agencies, Studios & Freelance",
    roles: [
      "UI/UX Designer",
      "Graphic Designer",
      "Art Director",
      "Illustrator",
      "Advertising",
      "Marketing",
    ],
    body: [
      {
        text: "Executed digital campaigns, brand systems, and interactive experiences for major clients. Established deep expertise in visual hierarchy, information density, and user psychology that forms the baseline of my current product architecture work.",
      },
    ],
  },
];

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const [open, setOpen] = useState(false);
  const headerId = `exp-${entry.id}-header`;
  const panelId = `exp-${entry.id}-panel`;

  return (
    <div className="exp-card rounded-[16px] p-[24px] flex flex-row gap-[32px] items-start">
      {/* Timeline column — pure CSS, no image. paddingTop centers the dot on the
          title row: half the title's line box (0.6 × font-size) minus half the dot. */}
      <div
        className="flex flex-col items-center self-stretch shrink-0 w-[16px]"
        style={{ paddingTop: "calc(0.6 * clamp(24px, 3.2vw, 40px) - 8px)" }}
      >
        <span
          className="rounded-full"
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid var(--cherry)",
            background: "transparent",
            marginBottom: "-2px",
          }}
        />
        <span
          className="flex-1"
          style={{ width: "2px", background: "var(--cherry)" }}
        />
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="exp-toggle w-full text-left flex flex-col gap-[16px]"
        >
          {/* Title row */}
          <span className="flex flex-row items-center gap-[24px]">
            <span
              className="font-mono font-normal whitespace-nowrap shrink-0"
              style={{
                fontSize: "clamp(24px, 3.2vw, 40px)",
                color: "var(--cherry)",
                lineHeight: "1.2",
              }}
            >
              {entry.years}
            </span>
            <span
              className="font-sans font-medium min-w-0"
              style={{
                fontSize: "clamp(24px, 3.2vw, 40px)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: "1.2",
              }}
            >
              {entry.company}
            </span>
            <svg
              className="exp-chevron ml-auto shrink-0"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{
                color: "var(--cherry)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* Roles row */}
          <span className="flex flex-row flex-wrap gap-[8px] items-baseline">
            {entry.roles.map((role, i) => (
              <Fragment key={role}>
                {i > 0 && (
                  <span
                    className="font-mono font-light"
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 24px)",
                      color: "var(--cherry)",
                      lineHeight: "1.2",
                    }}
                  >
                    /
                  </span>
                )}
                <span
                  className="font-sans font-normal"
                  style={{
                    fontSize: "clamp(16px, 1.6vw, 24px)",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: "1.2",
                  }}
                >
                  {role}
                </span>
              </Fragment>
            ))}
          </span>
        </button>

        {/* Body panel — grid-rows expand/collapse */}
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="exp-panel"
          data-open={open}
        >
          <div className="exp-panel-inner">
            <ul className="list-disc pt-[16px]">
              {entry.body.map((bullet, i) => (
                <li
                  key={i}
                  className="last:mb-0"
                  style={{
                    marginInlineStart: "24px",
                    marginBottom: "16px",
                    fontSize: "16px",
                    lineHeight: "normal",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                  }}
                >
                  {bullet.label && (
                    <strong className="font-bold">{bullet.label} </strong>
                  )}
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="flex flex-col overflow-hidden rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header — matches About/Contact: pt/pb 24 mobile, 48 desktop */}
      <div className="px-[24px] pt-[24px] pb-[24px] md:px-[48px] md:pt-[48px] md:pb-[48px]">
        <p className="heading-section w-full" style={{ color: "var(--cream)" }}>
          Experience
        </p>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-[16px] pb-[24px] md:pb-[48px]">
        {entries.map((entry) => (
          <div key={entry.id} className="px-[24px] md:px-[48px]">
            <ExperienceCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  );
}
