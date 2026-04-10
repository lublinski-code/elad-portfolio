"use client";

import { useEffect } from "react";
import { useActiveSection } from "@/components/nav/active-section-context";

export default function WorkPageMeta({ title }: { title: string }) {
  const { setPageTitle } = useActiveSection();

  useEffect(() => {
    // Scroll to top when entering an inner page
    window.scrollTo({ top: 0, behavior: "instant" });
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title, setPageTitle]);

  return null;
}
