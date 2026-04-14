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
      className="flex flex-col overflow-hidden rounded-none md:rounded-[24px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Header */}
      <div className="px-[24px] pt-[24px] md:px-[48px] md:pt-[48px]">
        <p className="heading-display w-full" style={{ color: "var(--cream)" }}>
          Experience
        </p>
      </div>

      {/* Employer blocks */}
      <div className="flex flex-col gap-[8px] py-[24px] md:gap-[16px] lg:gap-[48px] lg:py-[48px]">
        {entries.map((entry) => (
          <div key={entry.company} className="flex flex-col gap-[24px]">
            {/* Company header row */}
            <div
              className="flex flex-col gap-[16px] px-[24px] py-[24px] md:flex-row md:items-center md:px-[48px]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
            >
              <p
                className="font-mono font-normal shrink-0 whitespace-nowrap md:order-2"
                style={{
                  fontSize: "clamp(24px, 3.2vw, 40px)",
                  color: "var(--cherry)",
                  lineHeight: "1.2",
                }}
              >
                {entry.years}
              </p>
              <p
                className="flex-1 font-sans font-medium leading-normal min-w-0 md:order-1"
                style={{
                  fontSize: "clamp(24px, 3.2vw, 40px)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {entry.company}
              </p>
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-[16px] px-[24px] md:px-[48px]">
              {entry.roles.map((role) => (
                <div key={role} className="flex items-start gap-[16px]">
                  <span
                    className="font-mono font-light shrink-0"
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 24px)",
                      color: "var(--cherry)",
                      lineHeight: "1.5",
                    }}
                  >
                    ##
                  </span>
                  <p
                    className="font-sans font-normal leading-normal min-w-0"
                    style={{
                      fontSize: "clamp(16px, 1.8vw, 28px)",
                      color: "rgba(255,255,255,0.7)",
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
