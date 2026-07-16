import type { ReactNode } from "react";
import { Illus01, Illus02, Illus03 } from "./value-prop-illustrations";

const items: { n: string; text: string; Illus: () => ReactNode }[] = [
  {
    n: "01",
    text: "Discover what to solve before what to build",
    Illus: Illus01,
  },
  {
    n: "02",
    text: "Users click through real code, not mockups",
    Illus: Illus02,
  },
  {
    n: "03",
    text: "I build discovery workflows tuned to how your team works",
    Illus: Illus03,
  },
];

export default function ValueProp() {
  return (
    <div
      id="value"
      className="mb-[16px] grid auto-rows-fr grid-cols-1 gap-[16px] md:grid-cols-3 lg:grid-cols-3 lg:gap-[24px]"
    >
      {items.map(({ n, text, Illus }) => (
        <article
          key={n}
          className="vp-card group flex min-h-[240px] flex-col rounded-[24px] border border-[var(--cherry)] bg-[var(--cream)] p-[24px] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--cherry)] md:min-h-[288px] lg:min-h-[320px]"
        >
          <span className="font-mono text-[16px] leading-none text-[var(--cherry)] transition-colors duration-300 group-hover:text-[var(--cream)]">
            {n}
          </span>

          <div className="flex flex-1 items-center justify-center py-[16px]">
            <div className="w-[96px] text-[var(--charcoal)] transition-colors duration-300 group-hover:text-[var(--cream)] lg:w-[120px]">
              <Illus />
            </div>
          </div>

          <p className="font-mono text-[16px] leading-snug text-[var(--charcoal)] transition-colors duration-300 group-hover:text-[var(--cream)] md:text-[18px]">
            {text}
          </p>
        </article>
      ))}
    </div>
  );
}
