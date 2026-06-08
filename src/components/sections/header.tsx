export default function Header() {
  return (
    <header className="px-[24px] md:px-0">
      <div className="flex flex-row items-start justify-between gap-[16px]">
        <p
          className="font-mono font-medium text-[16px] leading-normal"
          style={{ color: "var(--cherry)" }}
        >
          --- Lublinski
        </p>
        <p
          className="font-mono font-normal text-[16px] leading-normal text-right shrink-0"
          style={{ color: "rgba(0,0,0,0.5)" }}
        >
          *Built using Claude Code
        </p>
      </div>
    </header>
  );
}
