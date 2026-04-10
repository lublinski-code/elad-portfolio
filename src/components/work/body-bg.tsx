"use client";

import { useEffect } from "react";

/** Sets body background for overscroll color matching. Restores on unmount. */
export default function BodyBackground({ color }: { color: string }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = color;
    return () => {
      document.body.style.background = prev;
    };
  }, [color]);

  return null;
}
