import Hi from "@/components/sections/hi";
import Work from "@/components/sections/work";
import Experience from "@/components/sections/experience";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import ScrollRestore from "@/components/work/scroll-restore";
import TetrisReveal from "@/components/easter-egg/tetris-reveal";

export default function Home() {
  return (
    <>
      <ScrollRestore />
      <main
        className="
          min-h-screen
          animate-[pageEnter_600ms_cubic-bezier(0.32,0.72,0,1)_both]
          p-[8px]
          pb-[calc(72px+env(safe-area-inset-bottom))]
          md:pt-[24px] md:pr-[24px] md:pb-[16px] md:pl-[8px]
          md:ml-[208px]
        "
        style={{ background: "var(--cream)" }}
      >
        <div className="flex flex-col gap-[8px] md:gap-[16px]">
          <Hi />
          <Work />
          <Experience />
          <About />
          <Contact />
          <Footer />
          <TetrisReveal />
        </div>
      </main>
    </>
  );
}
