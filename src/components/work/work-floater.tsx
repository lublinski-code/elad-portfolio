"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { WorkMeta } from "@/lib/content";

type Props = {
  fg: string;
  bg: string;
  prev: Pick<WorkMeta, "slug" | "title"> | null;
  next: Pick<WorkMeta, "slug" | "title"> | null;
};

export default function WorkFloater({ prev, next }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const close = () => {
    router.push("/");
  };

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
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && prev) router.push(`/work/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/work/${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev?.slug, next?.slug]);

  return (
    <div
      className="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:right-6 md:top-6"
      style={{
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Prev */}
      {prev ? (
        <Link
          href={`/work/${prev.slug}`}
          aria-label={`Previous: ${prev.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <ArrowIcon dir="left" />
        </Link>
      ) : (
        <span
          aria-disabled
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/30"
        >
          <ArrowIcon dir="left" />
        </span>
      )}

      {/* Next */}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          aria-label={`Next: ${next.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <ArrowIcon dir="right" />
        </Link>
      ) : (
        <span
          aria-disabled
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/30"
        >
          <ArrowIcon dir="right" />
        </span>
      )}

      {/* Divider */}
      <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />

      {/* Share */}
      <button
        type="button"
        onClick={share}
        aria-label={copied ? "Copied" : "Copy link"}
        className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
      >
        <ShareIcon />
        {copied ? "Copied" : "Share"}
      </button>

      {/* Close */}
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <CloseIcon />
      </button>
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

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3l10 10M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
