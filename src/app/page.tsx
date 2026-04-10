import Hi from "@/components/sections/hi";
import Work from "@/components/sections/work";
import Philosophy from "@/components/sections/philosophy";
import Experience from "@/components/sections/experience";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import ScrollRestore from "@/components/work/scroll-restore";

export default function Home() {
  return (
    <>
      <ScrollRestore />
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
    </>
  );
}
