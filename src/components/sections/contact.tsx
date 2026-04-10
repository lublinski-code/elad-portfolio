import { ArrowUpRight, Mail, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import "./contact.css";

type ContactLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const links: ContactLink[] = [
  {
    label: "@ LinkedIn",
    href: "https://www.linkedin.com/in/eladlublinski",
    icon: ArrowUpRight,
    accent: "#507dff",
  },
  {
    label: "@ GitHub",
    href: "https://github.com/lublinski-code",
    icon: ArrowUpRight,
    accent: "#5dfa00",
  },
  {
    label: "## Email",
    href: "mailto:lublinski.studio@gmail.com",
    icon: Mail,
    accent: "#ff02b8",
  },
  {
    label: "** Resume",
    href: "https://drive.google.com/file/d/150b__XyOsv6pmDal5qJAQCv61HyOe2aG/view?usp=sharing",
    icon: Download,
    accent: "#00f1c1",
  },
];

function ContactButton({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  return (
    <div
      className="contact-btn-wrapper relative"
      style={{ "--cb-accent": link.accent } as React.CSSProperties}
    >
      {/* Bevel — revealed when button lifts on hover */}
      <div
        className="absolute inset-0 rounded-[16px]"
        style={{ background: link.accent }}
        aria-hidden="true"
      />
      <a
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="contact-btn relative flex items-center gap-[16px] rounded-[16px] p-[24px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream)]"
        style={{ background: "var(--black)" }}
      >
        <span className="flex-1 font-mono font-medium text-[18px] leading-normal min-w-0">
          {link.label}
        </span>
        <Icon size={24} className="contact-btn-icon shrink-0" aria-hidden="true" />
      </a>
    </div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="flex flex-col gap-[24px]"
    >
      {/* Header card */}
      <div
        className="flex flex-col items-start justify-end rounded-[24px] p-[24px] md:p-[48px]"
        style={{
          background: "var(--sunflower)",
          minHeight: "clamp(280px, 36vw, 520px)",
        }}
      >
        <p
          className="heading-display w-full"
          style={{ color: "var(--black)" }}
        >
          Contact
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
        {/* Let's Talk heading */}
        <div className="flex items-center">
          <div className="hidden md:block flex-1" aria-hidden="true" />
          <p
            className="heading-display"
            style={{ color: "rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}
          >
            Let&apos;s Talk
          </p>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="w-full my-[24px]"
          style={{ borderTop: "1px solid rgba(0,0,0,0.5)" }}
        />

        {/* Action buttons — wraps naturally at any width */}
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <ContactButton key={link.label} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
}
