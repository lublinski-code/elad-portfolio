import ThemeToggle from "@/components/theme-toggle";

export default function Hero() {
  return (
    <>
      {/* Header */}
      <header className="mx-8 md:mx-16 border-b-2 border-[var(--border)]">
        <div className="flex items-center gap-12 py-6">
          <span className="text-[28px] font-normal shrink-0">
            Elad Lublinski
          </span>
          <nav className="hidden md:flex flex-1 justify-center gap-10 text-lg font-medium text-[var(--text-mute)]">
            <a href="#about" className="hover:text-[var(--text-accent)] transition-colors">About</a>
            <a href="#projects" className="hover:text-[var(--text-accent)] transition-colors">Projects</a>
            <a href="#contact" className="hover:text-[var(--text-accent)] transition-colors">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-16 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-[1312px] mx-auto w-full">
          <h1 className="text-[56px] md:text-[100px] lg:text-[140px] xl:text-[160px] font-light leading-[1.05] text-[var(--text-accent)] tracking-[-0.02em]">
            Hi, I&apos;m Elad
          </h1>

          <div className="mt-3 md:mt-5 max-w-[420px]">
            <p className="text-[20px] md:text-[28px] font-normal leading-[1.3] text-[var(--text-accent)]">
              An AI-informed human who believes the how is easy, but the what
              and the who are the real work.
            </p>
          </div>

          <h1 className="text-[56px] md:text-[100px] lg:text-[140px] xl:text-[160px] font-light leading-[1.05] text-[var(--text-accent)] tracking-[-0.02em] md:text-right mt-4 md:mt-2">
            A Product
          </h1>
          <h1 className="text-[56px] md:text-[100px] lg:text-[140px] xl:text-[160px] font-light leading-[1.05] text-[var(--text-accent)] tracking-[-0.02em] md:text-right">
            Designer
          </h1>
        </div>
      </section>
    </>
  );
}
