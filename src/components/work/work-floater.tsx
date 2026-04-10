"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { WorkMeta } from "@/lib/content";

type Props = {
  prev: Pick<WorkMeta, "slug" | "title"> | null;
  next: Pick<WorkMeta, "slug" | "title"> | null;
};

export default function WorkFloater({ prev, next }: Props) {
  const router = useRouter();
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
      if (e.key === "ArrowLeft" && prev) router.push(`/work/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/work/${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev?.slug, next?.slug]);

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-[24px] py-[16px] md:ml-[232px] md:px-[16px] md:pr-[48px]"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Left: back link */}
      <Link
        href="/"
        className="flex items-center gap-[8px] font-mono text-[13px] font-normal leading-normal transition-colors"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
      >
        <ArrowIcon dir="left" />
        Back
      </Link>

      {/* Right: prev/next + share */}
      <div className="flex items-center gap-[4px]">
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            <ArrowIcon dir="left" />
          </Link>
        ) : (
          <span
            aria-disabled
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <ArrowIcon dir="left" />
          </span>
        )}

        {next ? (
          <Link
            href={`/work/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            <ArrowIcon dir="right" />
          </Link>
        ) : (
          <span
            aria-disabled
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <ArrowIcon dir="right" />
          </span>
        )}

        <button
          type="button"
          onClick={share}
          aria-label={copied ? "Copied" : "Copy link"}
          className="flex h-9 items-center gap-[6px] rounded-full px-[12px] font-mono text-[12px] font-medium uppercase tracking-[0.06em] transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <ShareIcon />
          {copied ? "Copied" : "Share"}
        </button>
      </div>
    </div>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: dir === "right" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M10 2L4 8L10 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
