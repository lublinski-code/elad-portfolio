export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(0,0,0,0.12)",
        paddingTop: "16px",
        paddingBottom: "48px",
      }}
    >
      {/* Desktop/tablet: row. Mobile: column */}
      <div className="flex flex-col gap-[8px] md:flex-row md:gap-[16px] md:items-start">
        <p
          className="font-mono font-medium text-[16px] leading-normal md:flex-1"
          style={{ color: "rgba(0,0,0,0.7)" }}
        >
          --- Lublinski
        </p>
        <p
          className="font-mono font-normal text-[16px] leading-normal max-w-[259px] md:max-w-none md:text-right md:shrink-0"
          style={{ color: "rgba(0,0,0,0.5)" }}
        >
          Designed and built by Elad Lublinski with Claude Code &copy;2026
        </p>
      </div>
    </footer>
  );
}
