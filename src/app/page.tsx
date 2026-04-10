import Hi from "@/components/sections/hi";
import Work from "@/components/sections/work";
import Philosophy from "@/components/sections/philosophy";
import Experience from "@/components/sections/experience";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import SideNav from "@/components/nav/side-nav";
import BottomNav from "@/components/nav/bottom-nav";
import { ActiveSectionProvider } from "@/components/nav/active-section-context";
import ScrollRestore from "@/components/work/scroll-restore";

export default function Home() {
  return (
    <ActiveSectionProvider>
      <ScrollRestore />

      {/*
        Fixed side nav — 232px wide, pinned left.
        Hidden on mobile; bottom nav takes over.
      */}
      <SideNav />

      {/*
        Page shell: cream background shows through.
        On desktop: 232px left offset for side nav, then 48px padding on the
        remaining three sides (top, right, bottom). Left side gets only the
        16px that the nav's right-padding contributes, so the visual gap
        between nav cards and content cards is 32px total (16+16).
        On mobile: no side nav, so full-width with 24px padding all sides,
        plus bottom clearance for the bottom nav.
      */}
      <main
        className="
          min-h-screen
          px-[24px] pt-[24px]
          pb-[calc(24px+72px+env(safe-area-inset-bottom))]
          md:pl-[16px] md:pr-[48px] md:pt-[48px] md:pb-[48px]
          md:ml-[232px]
        "
        style={{ background: "var(--cream)" }}
      >
        {/*
          Section cards stack vertically.
          8px gap between each card, matching the side nav item gap.
        */}
        <div className="flex flex-col gap-[48px]">
          <Hi />
          <Work />
          <Philosophy />
          <Experience />
          <About />
          <Contact />
          <Footer />
        </div>
      </main>

      {/* Mobile bottom nav — hidden on md+ */}
      <BottomNav />
    </ActiveSectionProvider>
  );
}
