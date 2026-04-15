"use client";

import { usePathname } from "next/navigation";
import { ActiveSectionProvider } from "./active-section-context";
import SideNav from "./side-nav";
import BottomNav from "./bottom-nav";

type Props = {
  children: React.ReactNode;
  /** Pre-rendered inner side nav (server component) — shown on /work/* pages */
  innerNav: React.ReactNode;
  /** Pre-rendered inner bottom nav (server component) — shown on /work/* pages on mobile */
  innerBottomNav: React.ReactNode;
};

export default function RootShell({ children, innerNav, innerBottomNav }: Props) {
  const pathname = usePathname();
  const isInnerPage = pathname !== "/";

  return (
    <ActiveSectionProvider>
      {isInnerPage ? innerNav : <SideNav />}
      {children}
      {isInnerPage ? innerBottomNav : <BottomNav />}
    </ActiveSectionProvider>
  );
}
