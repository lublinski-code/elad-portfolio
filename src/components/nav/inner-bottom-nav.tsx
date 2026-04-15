"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ACCENT_HEX: Record<string, string> = {
  grape: "#6b2ed6",
  lime: "#399946",
  sunflower: "#f5c015",
  sky: "#507dff",
  mint: "#00d8ad",
  candy: "#e800a7",
  lemon: "#54e100",
};

const LIGHT_ACCENTS = new Set<string>(["lemon", "sunflower", "mint", "candy"]);

const ACTIVE_WIDTH = 280;
const INACTIVE_WIDTH = 142;

type WorkItem = { slug: string; navLabel: string; bg: string };
type Props = { items: WorkItem[] };

export default function InnerBottomNav({ items }: Props) {
  const pathname = usePathname();
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeSlug = pathname.startsWith("/work/")
    ? pathname.slice("/work/".length).split("/")[0]
    : null;

  // Auto-scroll to center the active item
  useEffect(() => {
    const key = activeSlug ?? "__back";
    const block = blockRefs.current[key];
    if (!block) return;
    block.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSlug]);

  return (
    <nav
      aria-label="Work projects"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      style={{ background: "var(--cream)" }}
    >
      <div
        className="no-scrollbar flex w-full gap-[8px] overflow-x-auto px-[24px] py-[24px]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
      >
        {/* Back button */}
        <a
          href="/#work"
          ref={(el) => {
            blockRefs.current["__back"] = el;
          }}
          className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] text-left"
          style={{
            width: INACTIVE_WIDTH,
            padding: 16,
            background: "var(--black)",
          }}
        >
          <span
            className="whitespace-nowrap font-mono text-[14px] font-normal leading-normal"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {"<--- back"}
          </span>
        </a>

        {/* Project pills */}
        {items.map((item) => {
          const accentBg = ACCENT_HEX[item.bg] ?? "#6b2ed6";
          const isActive = item.slug === activeSlug;
          const isLight = isActive && LIGHT_ACCENTS.has(item.bg);
          const textColor = isActive
            ? isLight
              ? "#000000"
              : "#ffffff"
            : "var(--black)";

          return (
            <a
              key={item.slug}
              href={`/work/${item.slug}`}
              ref={(el) => {
                blockRefs.current[item.slug] = el;
              }}
              aria-current={isActive ? "page" : undefined}
              className="relative flex shrink-0 items-center overflow-hidden rounded-[16px] text-left"
              style={{
                width: isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH,
                padding: 16,
                background: isActive ? accentBg : "var(--white)",
                transition:
                  "width 250ms cubic-bezier(0.32, 0.72, 0, 1), background 250ms cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              <span
                className="whitespace-nowrap font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: textColor,
                  transition: "color 200ms ease",
                }}
              >
                /{item.navLabel}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
