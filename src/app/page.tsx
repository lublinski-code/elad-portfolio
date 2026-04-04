import Hero from "@/components/parallax-hero";
import Card from "@/components/card";
import { ArrowDown, Mail, FileText, ExternalLink } from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const projects = [
  {
    category: "Side Project",
    title:
      "I had the product sense. I wanted to test if that was enough to ship.",
    subtitle:
      "A music battle game built from zero to live, using AI as a co-builder and years of design experience as the foundation",
    tags: [
      { icon: "target", label: "Exploration" },
      { icon: "target", label: "AI Development" },
      { icon: "clock", label: "3 weeks" },
    ],
    bg: "var(--lemon)",
    textColor: "var(--text-lemon)",
  },
  {
    category: "Personal",
    title: "Building a full AI team inside Claude Code",
    subtitle:
      "What happens when you treat AI agents like a real org chart? 15 specialized agents, 19 skill libraries, and a global ruleset in one CLI.",
    tags: [
      { icon: "target", label: "AI Workflow" },
      { icon: "target", label: "Exploration" },
      { icon: "clock", label: "Single session" },
    ],
    bg: "var(--mint)",
    textColor: "var(--text-mint)",
  },
];

const caseStudies = [
  {
    category: "Case Study",
    title: "Unlocking sponsorship offers for agency-represented creators",
    subtitle:
      "How we turned a blocked high-value segment into a growth engine",
    tags: [
      { icon: "target", label: "Growth" },
      { icon: "clock", label: "24 Weeks" },
      { icon: "party", label: "2.4x more campaigns per creator" },
    ],
    bg: "var(--sky)",
    textColor: "var(--text-sky)",
  },
  {
    category: "Case Study",
    title: "The drop-off that made us rethink our sponsorship product",
    subtitle:
      "An 80% loss of players, after campaigns ended, forced us to focus on a new user type - The audience",
    tags: [
      { icon: "target", label: "Retention" },
      { icon: "clock", label: "13 Weeks" },
      { icon: "party", label: "+21% ROAS D30" },
    ],
    bg: "var(--banana)",
    textColor: "var(--text-banana)",
  },
  {
    category: "Case Study",
    title: "We were losing players, so we changed the game",
    subtitle:
      "How we built a stronger connection between players and creators by Introducing Group Challenges & Duels",
    tags: [
      { icon: "target", label: "Growth" },
      { icon: "clock", label: "24 Weeks" },
      { icon: "party", label: "2.4x more campaigns per creator" },
    ],
    bg: "var(--lavender)",
    textColor: "var(--text-lavender)",
  },
  {
    category: "Case Study",
    title: "The missing habit loop",
    subtitle:
      "Re-engaging GrabTap Players with Smarter Notifications & Live Ops",
    tags: [
      { icon: "target", label: "Retention" },
      { icon: "clock", label: "8 Weeks" },
      { icon: "heartbreak", label: "Did not ship" },
    ],
    bg: "var(--mint)",
    textColor: "var(--text-mint)",
  },
  {
    category: "Case Study",
    title: "Friction at the highest-intent moment",
    subtitle:
      "Boosting Sponsorship Conversion With Viewer-First Landing Pages",
    tags: [
      { icon: "target", label: "Growth" },
      { icon: "clock", label: "24 Weeks" },
      { icon: "party", label: "2.4x more campaigns per creator" },
    ],
    bg: "var(--strawberry)",
    textColor: "var(--text-strawberry)",
  },
];

const experience = [
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
    company: "Freelance & Earlier Roles",
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

/* ─── Components ───────────────────────────────────── */

function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-12 border-b-2 border-[var(--border)] py-6 mx-8 md:mx-16">
      <h2 className="text-2xl font-normal">{title}</h2>
      {right && (
        <div className="ml-auto flex items-center gap-2 text-base text-[var(--text-mute)]">
          {right}
        </div>
      )}
    </div>
  );
}


/* ─── Timeline Experience ──────────────────────────── */

function ExperienceTimeline() {
  return (
    <div className="flex flex-col">
      {experience.map((company, companyIdx) => (
        <div key={companyIdx}>
          {/* Company name */}
          <h3 className="text-[28px] font-normal text-[var(--text-accent)] mb-2 mt-2">
            {company.company}
          </h3>

          {/* Roles with timeline */}
          {company.roles.map((role, roleIdx) => {
            const isLastRole = roleIdx === company.roles.length - 1;
            const isLastCompany = companyIdx === experience.length - 1;
            const showLine = !(isLastRole && isLastCompany);

            return (
              <div key={roleIdx} className="flex gap-6 md:gap-10">
                {/* Timeline track */}
                <div className="flex flex-col items-center pt-2 shrink-0 w-4">
                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full border-2 border-[var(--text-accent)] bg-[var(--bg)] shrink-0" />
                  {/* Line */}
                  {showLine && (
                    <div className="w-px flex-1 bg-[var(--text-light)]" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-10 flex-1 ${!showLine ? "pb-0" : ""}`}>
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                    <span className="text-lg font-medium text-[var(--text-accent)]">
                      {role.title}
                    </span>
                    <span className="text-sm text-[var(--text-accessible)]">
                      {role.period}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {role.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-base leading-[1.5] text-[var(--text-mute)] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--text-light)]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero (includes header) */}
      <Hero />

      {/* Projects */}
      <section id="projects" className="relative z-10 pb-20">
        <SectionHeader
          title="Projects"
          right={
            <>
              Scroll <ArrowDown size={18} />
            </>
          }
        />
        <div className="mt-14 px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <Card key={i} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="relative z-10 pb-20">
        <SectionHeader title="Selected Work" />
        <div className="mt-12 px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, i) => (
              <Card key={i} {...study} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 pb-20">
        <SectionHeader title="About" />
        <div className="max-w-[1312px] px-8 md:px-16 mt-10">
          <div className="grid grid-cols-1 gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex flex-col gap-6 text-base leading-[1.5] text-[var(--text-accent)]">
              <p>
                12+ years designing digital products across the creator economy,
                fintech, and gaming. Most recently at StreamElements, where I led
                design across a complex multi-sided platform, a sponsorships
                marketplace handling advertisers, agencies, creators, and
                audiences all at once, a large CRM and data platform powering it,
                and a suite of B2C engagement and monetization tools for
                streamers.
              </p>
              <p>
                My background is broad by design. I&apos;ve worked across B2B
                and B2C, from 0-to-1 founding roles to scaling design teams,
                from consumer-facing interfaces to enterprise workflows.
                What&apos;s stayed consistent is how I approach problems. I start
                with the user, get clear on what success looks like for a real
                person, align it with a business goal, then figure out how to
                build it.
              </p>
              <p>
                The last couple of years have been the most interesting of my
                career. I&apos;ve been learning to build with AI, actually build,
                prototyping and shipping with tools like Claude Code and Cursor,
                and figuring out what it means to work across design, product
                thinking, and development as one person. The quality of what AI
                produces is almost always a reflection of how clearly you
                understood the problem going in. That&apos;s where the design
                thinking still lives. This portfolio is a mix of that work.
                Products I&apos;ve designed, systems I&apos;ve built, and things
                I&apos;ve been learning by doing.
              </p>
            </div>

            {/* Image placeholder - hidden until photo is ready */}
            {/* <div className="hidden lg:block">
              <div className="w-full aspect-[3/4] rounded-2xl bg-[var(--text-light)] flex items-center justify-center">
                <span className="text-sm text-[var(--text-accessible)]">
                  Photo
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="relative z-10 pb-20">
        <SectionHeader title="Experience" />
        <div className="max-w-[900px] px-8 md:px-16 mt-10">
          <ExperienceTimeline />
        </div>
      </section>

      {/* Contact / Footer */}
      <footer
        id="contact"
        className="relative z-10 mx-8 md:mx-16 border-t-2 border-[var(--border)] py-12"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <span className="text-2xl font-normal">Get in touch</span>
          <div className="flex flex-wrap gap-6 md:ml-auto">
            <a
              href="mailto:lublinski.studio@gmail.com"
              className="flex items-center gap-2 text-base text-[var(--text-mute)] hover:text-[var(--text-accent)] transition-colors"
            >
              <Mail size={18} /> Email
            </a>
            <a
              href="https://www.linkedin.com/in/eladlublinski"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-[var(--text-mute)] hover:text-[var(--text-accent)] transition-colors"
            >
              <ExternalLink size={18} /> LinkedIn
            </a>
            <a
              href="https://github.com/lublinski-code"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-[var(--text-mute)] hover:text-[var(--text-accent)] transition-colors"
            >
              <ExternalLink size={18} /> GitHub
            </a>
            <a
              href="https://drive.google.com/file/d/150b__XyOsv6pmDal5qJAQCv61HyOe2aG/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-[var(--text-mute)] hover:text-[var(--text-accent)] transition-colors"
            >
              <FileText size={18} /> Resume
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
