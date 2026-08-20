import type { ComponentType } from "react";
import { Illus01, Illus02, Illus03 } from "./value-prop-illustrations";

const items: { n: string; text: string; Illus: ComponentType }[] = [
  {
    n: "01",
    text: "Build the AI-native design system and workflow, from nothing",
    Illus: Illus01,
  },
  {
    n: "02",
    text: "Bring structure to teams stuck on ad hoc decisions",
    Illus: Illus02,
  },
  {
    n: "03",
    text: "Tie user discovery to real business goals",
    Illus: Illus03,
  },
];

export default function ValueProp() {
  return (
    <div
      id="value"
      className="grid auto-rows-fr grid-cols-1 gap-[16px] md:grid-cols-3 lg:grid-cols-3 lg:gap-[24px]"
    >
      {items.map(({ n, text, Illus }) => (
        <article
          key={n}
          className="vp-card relative min-h-[260px] overflow-hidden rounded-[24px] border border-[var(--cherry)] bg-[var(--cream)] md:min-h-[288px] lg:min-h-[320px]"
        >
          <Illus />

          <span
            data-vp-number
            className="pointer-events-none absolute left-[24px] top-[24px] z-10 font-mono font-medium text-[16px] leading-none text-[var(--cherry)] md:text-[18px]"
          >
            {n}
          </span>

          <p
            data-vp-text
            className="pointer-events-none absolute bottom-[24px] left-[24px] right-[24px] z-10 font-mono text-[16px] leading-snug text-[#000000] md:text-[18px]"
          >
            {text}
          </p>
        </article>
      ))}
    </div>
  );
}
