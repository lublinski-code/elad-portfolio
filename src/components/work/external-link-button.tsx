import { ArrowUpRight, Gamepad2 } from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>> = {
  "arrow-up-right": ArrowUpRight,
  "gamepad-2": Gamepad2,
};

export type LinkDef = {
  label: string;
  href: string;
  icon?: string;
  variant?: "primary" | "secondary";
};

type Props = {
  link: LinkDef;
  accent: string;
};

export default function ExternalLinkButton({ link, accent }: Props) {
  const isSecondary = link.variant === "secondary";
  const IconComponent = ICON_MAP[link.icon ?? "arrow-up-right"] ?? ArrowUpRight;

  return (
    <div
      className="external-link-wrapper relative inline-block"
      style={{ "--ext-accent": accent } as React.CSSProperties}
    >
      <div
        className="external-link-bevel absolute inset-0 rounded-[16px]"
        aria-hidden="true"
      />
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="external-link relative flex items-center gap-[16px] rounded-[16px] p-[16px_24px]"
        style={isSecondary ? { background: "#ffffff" } : undefined}
      >
        <span
          className="font-mono text-[16px] font-normal leading-normal"
          style={{
            color: isSecondary ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
          }}
        >
          {link.label}
        </span>
        <IconComponent
          size={24}
          className="external-link-icon shrink-0"
          aria-hidden="true"
          style={isSecondary ? { color: "rgba(0,0,0,0.35)" } : undefined}
        />
      </a>
    </div>
  );
}
