"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./image-lightbox.css";

export default function ImageLightbox() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [index, setIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isOpen = index >= 0 && index < images.length;
  const current = isOpen ? images[index] : null;
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  // Collect all images on the page and handle clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const img = (e.target as HTMLElement).closest(".work-body img") as HTMLImageElement | null;
      if (!img) return;

      // Collect all work-body images fresh on each click
      const allImgs = Array.from(document.querySelectorAll(".work-body img")) as HTMLImageElement[];
      const items = allImgs.map((el) => ({ src: el.src, alt: el.alt || "" }));
      setImages(items);

      const clickedIdx = allImgs.indexOf(img);
      setIndex(clickedIdx >= 0 ? clickedIdx : 0);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Keyboard: ESC, left, right
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, close, prev, next]);

  if (!isOpen || !current) return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-label={current.alt || "Image preview"}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)" }}
      onClick={close}
    >
      {/* Top bar: counter + close */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-[24px] py-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="font-mono text-[13px] font-normal"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          aria-label="Close"
          className="font-mono text-[13px] font-medium"
          style={{
            color: "rgba(255,255,255,0.5)",
            padding: "4px 12px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
          }}
          onClick={close}
        >
          ESC
        </button>
      </div>

      {/* Previous button */}
      {hasPrev && (
        <button
          type="button"
          aria-label="Previous image"
          className="lightbox-nav absolute left-[16px] top-1/2 -translate-y-1/2 font-mono text-[24px] font-light"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          &larr;
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          type="button"
          aria-label="Next image"
          className="lightbox-nav absolute right-[16px] top-1/2 -translate-y-1/2 font-mono text-[24px] font-light"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          &rarr;
        </button>
      )}

      {/* Image + caption */}
      <div
        className="flex flex-col items-center gap-[16px] px-[72px] py-[48px]"
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt}
          style={{
            maxWidth: "100%",
            maxHeight: "calc(100vh - 120px)",
            objectFit: "contain",
            borderRadius: 0,
            cursor: "zoom-out",
          }}
          onClick={close}
        />
        {current.alt && (
          <p
            className="font-mono text-[13px] font-normal text-center"
            style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}
          >
            {current.alt}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
