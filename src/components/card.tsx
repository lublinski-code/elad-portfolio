"use client";

import { useState } from "react";

const CORNER = "0 0 56px 0"; // bottom-right only

function Tag({ label, textColor }: { label: string; textColor: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.08)", color: textColor }}
    >
      {label}
    </span>
  );
}

export default function Card({
  category,
  title,
  subtitle,
  tags,
  bg,
  textColor,
}: {
  category: string;
  title: string;
  subtitle: string;
  tags: { icon: string; label: string }[];
  bg: string;
  textColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col justify-end p-6 h-[324px] cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        backgroundColor: bg,
        borderRadius: hovered ? CORNER : "0",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm" style={{ color: textColor }}>
            {category}
          </span>
          <h3 className="text-[28px] md:text-[32px] font-normal leading-[1.2] text-[var(--text-accent)]">
            {title}
          </h3>
          <p className="text-lg font-medium text-[var(--text-accessible)]">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Tag key={i} label={tag.label} textColor={textColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
