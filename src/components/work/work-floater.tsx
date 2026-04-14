"use client";

import { useState } from "react";

export default function WorkFloater() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Copied" : "Copy link to clipboard"}
      className="absolute right-[16px] top-[16px] z-10 flex items-center gap-[6px] rounded-[8px] px-[12px] py-[8px] font-mono text-[12px] font-medium tracking-[0.06em] transition-colors"
      style={{
        background: "#2a2a2a",
        color: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#ffffff";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
    >
      <ShareIcon />
      {copied ? "Copied" : "Share"}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2v8M5 5l3-3 3 3M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
