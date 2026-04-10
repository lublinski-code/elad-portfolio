"use client";

import { useEffect } from "react";
import { useActiveSection } from "@/components/nav/active-section-context";

export default function WorkPageMeta({ title }: { title: string }) {
  const { setPageTitle } = useActiveSection();

  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title, setPageTitle]);

  return null;
}
