import { ArrowUpRight, Mail, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import "./contact.css";

type ContactLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const links: ContactLink[] = [
  {
    label: "@ LinkedIn",
    href: "https://www.linkedin.com/in/eladlublinski",
    icon: ArrowUpRight,
  },
  {
    label: "@ GitHub",
    href: "https://github.com/lublinski-code",
    icon: ArrowUpRight,
  },
  {
    label: "## Email",
    href: "mailto:lublinski.studio@gmail.com",
    icon: Mail,
  },
  {
    label: "** Resume",
    href: "https://drive.google.com/file/d/150b__XyOsv6pmDal5qJAQCv61HyOe2aG/view?usp=sharing",
    icon: Download,
  },
];

function ContactButton({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  return (
    <div className="contact-btn-wrapper relative">
      {/* Bevel — cream, revealed when button lifts on hover */}
      <div
        className="absolute inset-0 rounded-[16px]"
        style={{ background: "var(--cream)" }}
        aria-hidden="true"
      />
      <a
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="contact-btn relative flex items-center gap-[16px] rounded-[16px] p-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cherry)]"
        style={{ background: "var(--black)" }}
      >
        <span className="contact-btn-label flex-1 font-mono font-medium leading-normal min-w-0 whitespace-nowrap" style={{ fontSize: "18px" }}>
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
      className="flex flex-col overflow-hidden rounded-[24px]"
      style={{ background: "var(--cherry)" }}
    >
      {/* Header */}
      <div className="px-[24px] pt-[24px] md:px-[48px] md:pt-[48px]">
        <h2 className="heading-section w-full" style={{ color: "var(--cream)" }}>
          Contact
        </h2>
      </div>

      {/* Buttons */}
      <div className="px-[24px] py-[24px] md:px-[48px] md:py-[48px]">
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => (
            <ContactButton key={link.label} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
}
