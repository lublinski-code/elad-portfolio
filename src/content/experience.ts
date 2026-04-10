export type Role = {
  title: string;
  period: string;
  bullets: string[];
};

export type Company = {
  company: string;
  roles: Role[];
};

export const experience: Company[] = [
  {
    company: "StreamElements",
    roles: [
      {
        title: "Product Design Lead (Remote)",
        period: "Sep 2020 - Jan 2026",
        bullets: [
          "B2B & B2C SaaS Strategy: Led end-to-end design for the Sponsorships Marketplace and CRM, connecting enterprise brands with creators.",
          "AI & Innovation: Designed AI-powered campaign tools for agencies and implemented AI-driven workflows to accelerate internal design delivery.",
          "Gamification: Directed UX for a play-to-earn mobile app, using gamification mechanics to drive viewer engagement and retention.",
          "Leadership: Scaled the design system and mentored a design squad, aligning creative output with growth KPIs and establishing design as a strategic driver.",
        ],
      },
      {
        title: "Senior Product Designer",
        period: "Jan 2018 - Sep 2020",
        bullets: [
          "Founding Designer (0-to-1): Built the core product architecture, visual language, and DesignOps from scratch as the sole designer.",
          "Systems & Scale: Established the company's first design system and research loops, enabling product teams to scale rapidly.",
        ],
      },
    ],
  },
  {
    company: "Seeking Alpha",
    roles: [
      {
        title: "Senior Product Designer",
        period: "Nov 2015 - Dec 2017",
        bullets: [
          "Platform Optimization: Led UI/UX initiatives across desktop and mobile for a leading Fintech platform, focusing on content discoverability and financial data visualization.",
          "Growth Design: Delivered iterative improvements to engagement flows and retention loops, resulting in higher content consumption and smoother cross-platform usability.",
        ],
      },
      {
        title: "Mobile Products UI/UX Designer",
        period: "Oct 2014 - Nov 2015",
        bullets: [
          "Optimization: Optimized UI/UX across mobile products, improving usability, content discoverability and financial data visualization through wireframes and user testing.",
        ],
      },
    ],
  },
  {
    company: "Agencies, Studios & Freelance",
    roles: [
      {
        title: "Graphic Designer, Art Director, Illustrator",
        period: "2005 - 2014",
        bullets: [
          "Worked with agencies and brands on UI/UX, branding and digital campaigns.",
          "Designed for major clients, delivering visual identities, websites, and interactive advertising experiences.",
        ],
      },
    ],
  },
];
