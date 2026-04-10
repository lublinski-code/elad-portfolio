"use client";

import { sections } from "./sections";
import { useActiveSection } from "./active-section-context";
import "./side-nav.css";

const PILL_HEIGHT = 300;
const NOTCH_H = 32;
const NOTCH_INSET = 8;
const NOTCH_TRAVEL = PILL_HEIGHT - NOTCH_H - NOTCH_INSET * 2;

export default function SideNav() {
  const { activeId, progress, setActiveId } = useActiveSection();

  const handleClick = (id: string) => {
    // Immediately switch the active pill with notch at top
    setActiveId(id as typeof activeId);

    // Scroll the page to the section
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed left-0 top-0 z-30 hidden md:block"
      style={{ width: 232 }}
    >
      <div
        className="flex w-full flex-col gap-[8px]"
        style={{ padding: "48px 16px 48px 48px" }}
      >
        {/* Identity card — not interactive */}
        <div
          className="flex shrink-0 flex-col gap-[8px] rounded-[16px] bg-white p-[16px]"
          style={{ width: 168 }}
        >
          <span
            className="font-mono text-[11px] font-medium leading-normal"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            ---
          </span>
          <span
            className="font-mono text-[14px] font-normal leading-normal"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            Lublinski
          </span>
        </div>

        {/* Section pills */}
        {sections.map((s) => {
          const isActive = s.id === activeId;
          const isSunflower = s.id === "contact";

          // Notch translates from 8px to (300 - 32 - 8)px
          const notchTop = NOTCH_INSET + progress * NOTCH_TRAVEL;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleClick(s.id)}
              aria-current={isActive ? "true" : undefined}
              className="nav-pill group relative flex shrink-0 flex-col items-start overflow-hidden rounded-[16px] text-left"
              style={
                {
                  "--pill-bg": s.bg,
                  "--pill-spacer": isActive ? `${PILL_HEIGHT - 73}px` : "0px",
                  width: 168,
                  // Extra right padding on active pill so text doesn't collide with notch
                  padding: isActive ? "16px 32px 16px 16px" : "16px",
                } as React.CSSProperties
              }
            >
              {/* Expandable spacer — pushes content to bottom when active */}
              <div className="nav-pill-spacer" />

              {/* Scroll progress notch */}
              <span
                aria-hidden="true"
                className="nav-notch pointer-events-none absolute right-[8px] w-[16px] rounded-[8px]"
                style={{
                  height: NOTCH_H,
                  background: "var(--cream)",
                  top: notchTop,
                  opacity: isActive ? 1 : 0,
                }}
              />

              {/* Prefix glyph */}
              <span
                className="block font-mono text-[11px] font-medium leading-normal"
                style={{
                  color: isSunflower
                    ? "rgba(0,0,0,0.5)"
                    : "rgba(255,255,255,0.7)",
                  marginBottom: 8,
                }}
              >
                #
              </span>

              {/* Page label */}
              <span
                className="block font-mono text-[14px] font-normal leading-normal"
                style={{
                  color: isSunflower ? "var(--black)" : "var(--white)",
                }}
              >
                /{s.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
