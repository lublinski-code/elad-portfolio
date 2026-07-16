import type { ReactNode } from "react";

/**
 * Value-prop card illustrations. Three static line drawings, each 0 0 120 120,
 * charcoal-idle → cream-hover via currentColor (the card swaps text color on
 * .vp-card:hover). Idle is fully static — the marquee is the page's only
 * ambient motion. Hover plays ONE primary move that enacts the concept plus at
 * most one staggered secondary; 300ms, cubic-bezier(0.32,0.72,0,1),
 * transform/opacity/dashoffset only. All motion is defined in globals.css keyed
 * off .vp-card:hover, using transform-box: view-box so transform-origin reads
 * in the SVG's own 120px coordinates. prefers-reduced-motion → color swap only.
 */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-auto w-full overflow-hidden"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// 01 — Discover what to solve before what to build.
// A field of scattered problem-dots with a magnifier resting among them. Hover:
// the magnifier settles onto ONE dot and that dot fills solid (choosing, not
// searching); the other dots fade back a beat later.
const dots01 = [
  { key: "a", cx: 22, cy: 30 },
  { key: "b", cx: 44, cy: 22 },
  { key: "c", cx: 96, cy: 34 },
  { key: "d", cx: 26, cy: 84 },
  { key: "e", cx: 70, cy: 96 },
  { key: "f", cx: 100, cy: 78 },
];

export function Illus01() {
  return (
    <Svg>
      {dots01.map(({ key, cx, cy }) => (
        <circle
          key={key}
          className="vpi-anim vpi-01-dot"
          cx={cx}
          cy={cy}
          r={5}
        />
      ))}
      <circle
        className="vpi-anim vpi-01-target"
        cx={76}
        cy={60}
        r={5}
        fill="currentColor"
        style={{ transformOrigin: "76px 60px" }}
      />
      <g className="vpi-anim vpi-01-glass" style={{ transformOrigin: "50px 56px" }}>
        <circle cx={48} cy={54} r={15} />
        <line x1={58.6} y1={64.6} x2={74} y2={80} />
      </g>
    </Svg>
  );
}

// 02 — Users click through real code, not mockups.
// A dashed flat wireframe sits behind a solid browser window with a button.
// Hover: a cursor moves in and the button presses (fills + scales down) — the
// real thing responds; the dashed mockup stays inert and fades back slightly.
export function Illus02() {
  return (
    <Svg>
      <rect
        className="vpi-anim vpi-02-mockup"
        x={12}
        y={16}
        width={64}
        height={48}
        rx={6}
        strokeDasharray="5 5"
      />
      <rect x={40} y={44} width={68} height={56} rx={6} />
      <line x1={40} y1={58} x2={108} y2={58} />
      <circle cx={48} cy={51} r={2} fill="currentColor" stroke="none" />
      <circle cx={56} cy={51} r={2} fill="currentColor" stroke="none" />
      <rect
        className="vpi-anim vpi-02-btn"
        x={58}
        y={72}
        width={36}
        height={16}
        rx={4}
        fill="currentColor"
        style={{ transformOrigin: "76px 80px" }}
      />
      <path
        className="vpi-anim vpi-02-cursor"
        d="M94 82 L94 100 L98 95.5 L101 102 L104 100.5 L101 94 L107 94 Z"
        fill="currentColor"
        stroke="none"
        style={{ transformOrigin: "100px 91px" }}
      />
    </Svg>
  );
}

// 03 — I build discovery workflows tuned to how your team works.
// Three outlined circles (the client's team) in fixed positions, unconnected.
// Hover: a loop draws to connect the three, and each pulses once as the loop
// reaches it — the workflow forms around the team.
const people03 = [
  { key: "p1", cx: 32, cy: 46, delay: "0ms" },
  { key: "p2", cx: 88, cy: 40, delay: "60ms" },
  { key: "p3", cx: 58, cy: 92, delay: "120ms" },
];

export function Illus03() {
  return (
    <Svg>
      <path
        className="vpi-anim vpi-03-loop"
        d="M32 46 L88 40 L58 92 Z"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100}
      />
      {people03.map(({ key, cx, cy, delay }) => (
        <circle
          key={key}
          className="vpi-anim vpi-03-person"
          cx={cx}
          cy={cy}
          r={8}
          fill="currentColor"
          style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: delay }}
        />
      ))}
    </Svg>
  );
}
