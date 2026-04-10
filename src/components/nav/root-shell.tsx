"use client";

import { ActiveSectionProvider } from "./active-section-context";
import SideNav from "./side-nav";
import BottomNav from "./bottom-nav";

export default function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <ActiveSectionProvider>
      <SideNav />
      {children}
      <BottomNav />
    </ActiveSectionProvider>
  );
}
