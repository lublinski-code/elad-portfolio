type ExperienceEntry = {
  company: string;
  years: string;
  roles: string[];
};

const entries: ExperienceEntry[] = [
  {
    company: "StreamElements",
    years: "2018-2026",
    roles: [
      "Product Design Lead",
      "Senior Product Designer - Founding Designer",
    ],
  },
  {
    company: "Seeking Alpha",
    years: "2014-2017",
    roles: [
      "Senior Product Designer",
      "Mobile Product UI/UX Designer",
    ],
  },
  {
    company: "Agencies, Studios & Freelance",
    years: "2005-2014",
    roles: [
      "UI/UX Designer",
      "Art Director",
      "Illustrator",
      "Graphic Designer",
      "Advertising",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="flex flex-col gap-[24px]"
    >
      {/* Header card */}
      <div
        className="flex flex-col items-start justify-end rounded-[24px] p-[24px] md:p-[48px]"
        style={{
          background: "var(--sky)",
          minHeight: "clamp(280px, 36vw, 520px)",
        }}
      >
        <p
          className="heading-display w-full"
          style={{ color: "var(--cream)" }}
        >
          Experience
        </p>
      </div>

      {/* Content card */}
      <div
        className="flex flex-col rounded-[24px]"
        style={{
          background: "var(--cream)",
          border: "1px solid rgba(0,0,0,0.5)",
          padding: "clamp(24px, 4vw, 48px)",
        }}
      >
        {entries.map((entry, entryIdx) => (
          <div key={entry.company}>
            {/* Divider between companies */}
            {entryIdx > 0 && (
              <div
                aria-hidden="true"
                className="w-full my-[24px] md:my-[24px]"
                style={{ height: "1px", background: "rgba(0,0,0,0.5)" }}
              />
            )}

            <div className="flex flex-col gap-[8px] md:gap-[16px]">
              {/* Company name + year range */}
              {/* Mobile: stacked (year above name). Desktop/tablet: inline row */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-[16px]">
                <p
                  className="font-mono font-light shrink-0 whitespace-nowrap md:order-2"
                  style={{
                    fontSize: "clamp(16px, 2.5vw, 40px)",
                    color: "var(--sky)",
                    lineHeight: "1.2",
                  }}
                >
                  {entry.years}
                </p>
                <p
                  className="flex-1 font-sans font-bold leading-normal min-w-0 md:order-1"
                  style={{
                    fontSize: "clamp(32px, 4.4vw, 64px)",
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  {entry.company}
                </p>
              </div>

              {/* Roles */}
              {entry.roles.map((role) => (
                <div key={role} className="flex items-start gap-[16px]">
                  <span
                    className="font-mono font-light shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 24px)",
                      color: "var(--sky)",
                      lineHeight: "1.5",
                    }}
                  >
                    ##
                  </span>
                  <p
                    className="font-sans font-normal leading-normal min-w-0"
                    style={{
                      fontSize: "clamp(16px, 1.8vw, 28px)",
                      color: "rgba(0,0,0,0.7)",
                    }}
                  >
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
