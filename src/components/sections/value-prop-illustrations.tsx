"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Value-prop card illustrations. Each is a card-filling, cursor-driven scene.
 *
 * REST STATE CARRIES THE MESSAGE. Every scene is a complete, legible drawing of
 * the RESOLVED idea — the system built, the structure in place, the two things
 * tied together — because on touch there is no hover and the static drawing is
 * all the card ever shows. The pointer interaction is a reward layered on top,
 * never the thing that makes the card readable. Interactivity is gated behind
 * `(hover: hover) and (pointer: fine)` and disabled under
 * `prefers-reduced-motion: reduce`.
 *
 * Coordinate system: each SVG fills its container (h-full w-full) and its
 * viewBox is set to the container's measured pixel size, so 1 user unit === 1
 * CSS px. The scene is authored as a group of elements at OFFSETS FROM A
 * COMPOSITION CENTER and placed with a single group transform
 * `translate(Cx,Cy) scale(s)` — this is what keeps every scene dead-centre in
 * its card. Cx/Cy/s are measured from the real card DOM (the number + text
 * overlays) so the composition sits in the visual band between them. A single
 * requestAnimationFrame loop runs ONLY while the pointer is inside (plus a brief
 * settle), writing transforms/attributes straight to the DOM — no React
 * re-render per pointer move. SSR-safe: capability media queries are read in an
 * effect and default to static on first paint (rendered with the fallback
 * transform, which the client reproduces exactly → no hydration mismatch).
 */

// Muted idle line colour for the illustrations (softened per feedback).
const CHARCOAL = "rgba(0,0,0,0.45)";
const CHERRY = "var(--cherry)";
const CREAM = "var(--cream)";

// Default dims for SSR / first paint — the scene is complete at these before the
// container is measured on mount.
const D = { w: 300, h: 288 };

const STROKE = 2.5;
const K = 0.22; // follow easing

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Center = { Cx: number; Cy: number; s: number };

/**
 * Composition placement from the measured band between the number overlay
 * (bottom) and the text overlay (top). Center X is dead-centre horizontally;
 * center Y sits 45% down the band; scale fits compHeight into the band.
 */
function computeCenter(
  dims: { w: number; h: number },
  numberBottom: number,
  textTop: number,
  compHeight: number,
  compWidth: number,
  baseScale = 1,
): Center {
  const band = textTop - numberBottom;
  // Fit to BOTH the height band and the card width so the scene shrinks to fit
  // instead of getting clipped when the card gets narrow.
  const heightScale = (band - 16) / compHeight;
  const widthScale = (dims.w - 32) / compWidth;
  return {
    Cx: dims.w / 2,
    Cy: numberBottom + 0.45 * band,
    s: clamp(Math.min(heightScale, widthScale), 0.4, 1) * baseScale,
  };
}

/** Read the real card DOM to place the composition. Falls back to constants. */
function measure(
  root: HTMLDivElement,
  compHeight: number,
  compWidth: number,
  fallbackTextBlock: number,
  baseScale = 1,
): Center & { dims: { w: number; h: number } } {
  const dims = { w: root.clientWidth || D.w, h: root.clientHeight || D.h };
  const rootRect = root.getBoundingClientRect();
  const card = root.closest(".vp-card");
  const numEl = card?.querySelector("[data-vp-number]") ?? null;
  const txtEl = card?.querySelector("[data-vp-text]") ?? null;
  let numberBottom = 54;
  let textTop = dims.h - (24 + fallbackTextBlock);
  if (numEl && txtEl && rootRect.height > 0) {
    numberBottom = numEl.getBoundingClientRect().bottom - rootRect.top;
    textTop = txtEl.getBoundingClientRect().top - rootRect.top;
  }
  return {
    dims,
    ...computeCenter(dims, numberBottom, textTop, compHeight, compWidth, baseScale),
  };
}

/** Deterministic transform for SSR + first client paint (no hydration diff). */
function initialTransform(
  compHeight: number,
  compWidth: number,
  fallbackTextBlock: number,
  baseScale = 1,
): string {
  const numberBottom = 54;
  const textTop = D.h - (24 + fallbackTextBlock);
  const { Cx, Cy, s } = computeCenter(
    D,
    numberBottom,
    textTop,
    compHeight,
    compWidth,
    baseScale,
  );
  return `translate(${Cx} ${Cy}) scale(${s})`;
}

function useAnimateEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(hover.matches && !motion.matches);
    update();
    hover.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);
  return enabled;
}

function CanvasRoot({
  rootRef,
  children,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="absolute inset-0 select-none"
      style={{ touchAction: "manipulation" }}
    >
      {children}
    </div>
  );
}

function Scene({
  svgRef,
  groupRef,
  initial,
  children,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  groupRef: React.RefObject<SVGGElement | null>;
  initial: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${D.w} ${D.h}`}
      className="vpi-svg h-full w-full"
      fill="none"
      stroke={CHARCOAL}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g ref={groupRef} transform={initial}>
        {children}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 01 — Build the AI-native design system and workflow, from nothing.
// Rest: a finished product window — title bar, traffic dots, a real button.
// The built thing, legible with no interaction at all. Interactive: the OS
// cursor hides and the arrow becomes the pointer (tip = hotspot); driving it
// onto the button fills the pill cherry and the window comes alive behind it.
// ---------------------------------------------------------------------------
const WIN_01 = { w: 200, h: 121, rx: 8 };
const DIVIDER_Y_01 = -45;
const DOT_Y_01 = -51;
const DOTS_X_01 = [-90, -82, -74];
const BTN_01 = { cx: -1, cy: 24, w: 88, h: 28 };
const ARROW_REST_01 = { x: 54, y: 42 }; // arrow tip — straddling the window's bottom edge
// Arrow pointer with its tip at the group origin (0,0), ~25 x 38.
const ARROW_PATH_01 = "M0 0 L0 34 L8 26 L13.5 38 L19 35 L13.5 23.5 L25 23.5 Z";
const COMP_H_01 = 140; // window + the cursor that hangs past its bottom edge
const COMP_W_01 = 200;
const TEXTBLOCK_01 = 70; // 3 lines of card text
const BASE_01 = 0.88;

// Background "the product responds" layer: sine waves clipped to the window
// body, scrolling right→left while the cursor is over the button.
const WINDOW_CLIP_ID_01 = "vp1-window-clip"; // single card-01 instance → stable
const WAVE_WAVELENGTH_01 = 44;
const WAVE_AMP_01 = 5;
const WAVE_WIDTH_01 = WIN_01.w * 2; // ~2× window width so scroll wraps seamlessly
const WAVE_SPACING_01 = 22;
const WAVE_SPEED_01 = 0.6; // px/frame leftward
const WAVE_EASE_01 = 0.12;

/** One vertical sine-wave line centred on xMid, spanning y[top, bottom]. */
function waveLinePath(
  xMid: number,
  amp: number,
  wavelength: number,
  yTop: number,
  yBottom: number,
): string {
  const step = wavelength / 12;
  const sway = (y: number) =>
    xMid + amp * Math.sin((y / wavelength) * Math.PI * 2);
  let d = `M ${sway(yTop).toFixed(2)} ${yTop.toFixed(2)}`;
  for (let y = yTop + step; y <= yBottom; y += step) {
    d += ` L ${sway(y).toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

export function Illus01() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const btnRef = useRef<SVGRectElement>(null);
  const arrowRef = useRef<SVGGElement>(null);
  const waveRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const btn = btnRef.current;
    const arrow = arrowRef.current;
    const wave = waveRef.current;
    if (!root || !svg || !group || !btn || !arrow || !wave) return;

    let raf = 0;
    let inside = false;
    let settled = true;
    let over = false;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { ...ARROW_REST_01 };
    const tgt = { ...ARROW_REST_01 };
    let waveOffset = 0;
    let waveOpacity = 0;

    const placeArrow = (x: number, y: number) =>
      arrow.setAttribute("transform", `translate(${x} ${y})`);

    const setOver = (v: boolean) => {
      if (v === over) return;
      over = v;
      btn.setAttribute("fill", v ? CHERRY : "none");
      btn.setAttribute("stroke", v ? CHERRY : CHARCOAL);
    };

    const layout = () => {
      const m = measure(root, COMP_H_01, COMP_W_01, TEXTBLOCK_01, BASE_01);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
      if (!inside && settled) {
        cur.x = ARROW_REST_01.x;
        cur.y = ARROW_REST_01.y;
        placeArrow(cur.x, cur.y);
      }
    };

    const frame = () => {
      const target = inside ? tgt : ARROW_REST_01;
      cur.x += (target.x - cur.x) * K;
      cur.y += (target.y - cur.y) * K;
      placeArrow(cur.x, cur.y);

      if (inside) {
        setOver(
          Math.abs(cur.x - BTN_01.cx) < BTN_01.w / 2 &&
            Math.abs(cur.y - BTN_01.cy) < BTN_01.h / 2,
        );
      } else {
        setOver(false);
      }

      if (inside) {
        waveOffset -= WAVE_SPEED_01;
        if (waveOffset <= -WAVE_SPACING_01) waveOffset += WAVE_SPACING_01;
        wave.setAttribute("transform", `translate(${waveOffset.toFixed(2)} 0)`);
      }
      const waveTarget = over ? 1 : 0;
      waveOpacity += (waveTarget - waveOpacity) * WAVE_EASE_01;
      wave.style.opacity = waveOpacity.toFixed(3);
      const waveSettling = Math.abs(waveTarget - waveOpacity) > 0.005;

      settled =
        !inside &&
        Math.hypot(target.x - cur.x, target.y - cur.y) < 0.5 &&
        !waveSettling;
      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        placeArrow(target.x, target.y);
      }
    };

    const toLocal = (e: PointerEvent) => ({
      x: (e.clientX - rect.left - c.Cx) / c.s,
      y: (e.clientY - rect.top - c.Cy) / c.s,
    });

    const onEnter = (e: PointerEvent) => {
      inside = true;
      settled = false;
      rect = root.getBoundingClientRect();
      const p = toLocal(e);
      tgt.x = p.x;
      tgt.y = p.y;
      root.style.cursor = "none";
      arrow.setAttribute("stroke", CHERRY);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      const p = toLocal(e);
      tgt.x = p.x;
      tgt.y = p.y;
    };
    const onLeave = () => {
      inside = false;
      root.style.cursor = "";
      arrow.setAttribute("stroke", CHARCOAL);
      setOver(false);
      if (!raf) raf = requestAnimationFrame(frame);
    };

    layout();
    const ro = new ResizeObserver(() => {
      rect = root.getBoundingClientRect();
      layout();
    });
    ro.observe(root);
    const onScroll = () => {
      rect = root.getBoundingClientRect();
    };

    if (enabled) {
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      root.style.cursor = "";
    };
  }, [enabled]);

  return (
    <CanvasRoot rootRef={rootRef}>
      <Scene
        svgRef={svgRef}
        groupRef={groupRef}
        initial={initialTransform(COMP_H_01, COMP_W_01, TEXTBLOCK_01, BASE_01)}
      >
        <rect
          x={-WIN_01.w / 2}
          y={-WIN_01.h / 2}
          width={WIN_01.w}
          height={WIN_01.h}
          rx={WIN_01.rx}
        />
        <line
          x1={-WIN_01.w / 2}
          y1={DIVIDER_Y_01}
          x2={WIN_01.w / 2}
          y2={DIVIDER_Y_01}
        />
        {/* Background: scrolling wave pattern clipped to the window body,
            behind the dots / button / arrow, opacity 0 at rest. */}
        <clipPath id={WINDOW_CLIP_ID_01}>
          <rect
            x={-WIN_01.w / 2}
            y={DIVIDER_Y_01}
            width={WIN_01.w}
            height={WIN_01.h / 2 - DIVIDER_Y_01}
          />
        </clipPath>
        <g clipPath={`url(#${WINDOW_CLIP_ID_01})`}>
          <g
            ref={waveRef}
            style={{ opacity: 0, willChange: "opacity, transform" }}
          >
            {Array.from({
              length: Math.ceil(WAVE_WIDTH_01 / WAVE_SPACING_01) + 1,
            }).map((_, i) => (
              <path
                key={i}
                d={waveLinePath(
                  -WAVE_WIDTH_01 / 2 + i * WAVE_SPACING_01,
                  WAVE_AMP_01,
                  WAVE_WAVELENGTH_01,
                  DIVIDER_Y_01,
                  WIN_01.h / 2,
                )}
                fill="none"
                stroke={CHERRY}
                strokeWidth={STROKE}
              />
            ))}
          </g>
        </g>
        {DOTS_X_01.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={DOT_Y_01}
            r={2}
            fill={CHARCOAL}
            stroke="none"
          />
        ))}
        <rect
          ref={btnRef}
          x={BTN_01.cx - BTN_01.w / 2}
          y={BTN_01.cy - BTN_01.h / 2}
          width={BTN_01.w}
          height={BTN_01.h}
          rx={BTN_01.h / 2}
          style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
        />
        <g
          ref={arrowRef}
          transform={`translate(${ARROW_REST_01.x} ${ARROW_REST_01.y})`}
          stroke={CHARCOAL}
          style={{ willChange: "transform" }}
        >
          <path d={ARROW_PATH_01} fill={CREAM} />
        </g>
      </Scene>
    </CanvasRoot>
  );
}

// ---------------------------------------------------------------------------
// 02 — Bring structure to teams stuck on ad hoc decisions.
// Rest: the structure itself — a hub and a six-point ring, every link drawn.
// Ordered and complete with no interaction. Interactive: a cherry wavefront
// sweeps steadily left to right across the structure, lighting each link and
// node as it passes. The sweep is independent of where the pointer is — firing
// it from the nearest node made it restart and jump every time you moved.
// ---------------------------------------------------------------------------
const HUB_R_02 = 20;
const OUTER_R_02 = 12;
const RING_R_02 = 60;
const NODES_02: { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: 0, y: -RING_R_02 },
  { x: 51.96, y: -30 },
  { x: 51.96, y: 30 },
  { x: 0, y: RING_R_02 },
  { x: -51.96, y: 30 },
  { x: -51.96, y: -30 },
];
// Hub spokes + ring perimeter.
const EDGES_02: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 1],
];

/** Edge endpoints trimmed to each end's rim, so links never cut through a node. */
function trimEdge(
  a: { x: number; y: number },
  b: { x: number; y: number },
  ra: number,
  rb: number,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * ra,
    y1: a.y + uy * ra,
    x2: b.x - ux * rb,
    y2: b.y - uy * rb,
  };
}

/** Radius of node i — index 0 is the hub. */
const radius02 = (i: number) => (i === 0 ? HUB_R_02 : OUTER_R_02);

const SWEEP_SPEED_02 = 0.006; // phase per frame — one pass ≈ 2.8s
const SWEEP_FROM_02 = -95; // starts clear of the left edge
const SWEEP_TO_02 = 95; // ends clear of the right edge
const SWEEP_BAND_02 = 46; // thickness of the travelling front
// Without this the front only grazes full strength, so a cherry line at ~0.1
// opacity over cream reads as nothing. Boosting plateaus the core of the front
// at full opacity and keeps a soft edge.
const SWEEP_BOOST_02 = 1.9;
const PULSE_EASE_02 = 0.1; // master fade in / out of the whole signal
const LIT_STROKE_02 = STROKE + 1.2; // lit links sit proud of the base line
const CURSOR_R_02 = 12.5;
const COMP_H_02 = 150;
const COMP_W_02 = 150;
const TEXTBLOCK_02 = 48;

export function Illus02() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<SVGCircleElement>(null);
  const litNodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const litEdgeRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const cursor = cursorRef.current;
    if (!root || !svg || !group || !cursor) return;

    let raf = 0;
    let inside = false;
    let settled = true;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let sweepT = 0;
    let reveal = 0;

    const layout = () => {
      const m = measure(root, COMP_H_02, COMP_W_02, TEXTBLOCK_02);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
    };

    const frame = () => {
      cur.x += (tgt.x - cur.x) * K;
      cur.y += (tgt.y - cur.y) * K;
      cursor.setAttribute("transform", `translate(${cur.x} ${cur.y})`);

      if (inside) {
        sweepT += SWEEP_SPEED_02;
        if (sweepT >= 1) sweepT -= 1;
      }
      reveal += ((inside ? 1 : 0) - reveal) * PULSE_EASE_02;

      // One front, always travelling the same way, so the rhythm never jumps.
      const front = lerp(SWEEP_FROM_02, SWEEP_TO_02, sweepT);
      const litAt = (x: number) =>
        clamp(
          (1 - Math.abs(x - front) / SWEEP_BAND_02) * SWEEP_BOOST_02,
          0,
          1,
        ) * reveal;

      for (let i = 0; i < NODES_02.length; i++) {
        const el = litNodeRefs.current[i];
        if (!el) continue;
        el.style.opacity = litAt(NODES_02[i].x).toFixed(3);
      }
      // The links carry the sweep too, keyed off each link's midpoint, so a line
      // lights between the node it leaves and the one it reaches.
      for (let e = 0; e < EDGES_02.length; e++) {
        const el = litEdgeRefs.current[e];
        if (!el) continue;
        const [a, b] = EDGES_02[e];
        const mx = (NODES_02[a].x + NODES_02[b].x) / 2;
        el.style.opacity = litAt(mx).toFixed(3);
      }

      settled = !inside && reveal < 0.004;
      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const toLocal = (e: PointerEvent) => ({
      x: (e.clientX - rect.left - c.Cx) / c.s,
      y: (e.clientY - rect.top - c.Cy) / c.s,
    });

    const onEnter = (e: PointerEvent) => {
      inside = true;
      settled = false;
      rect = root.getBoundingClientRect();
      const p = toLocal(e);
      cur.x = p.x;
      cur.y = p.y;
      tgt.x = p.x;
      tgt.y = p.y;
      cursor.setAttribute("transform", `translate(${cur.x} ${cur.y})`);
      cursor.style.opacity = "1";
      root.style.cursor = "none";
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      const p = toLocal(e);
      tgt.x = p.x;
      tgt.y = p.y;
    };
    const onLeave = () => {
      inside = false;
      cursor.style.opacity = "0";
      root.style.cursor = "";
      if (!raf) raf = requestAnimationFrame(frame);
    };

    layout();
    const ro = new ResizeObserver(() => {
      rect = root.getBoundingClientRect();
      layout();
    });
    ro.observe(root);
    const onScroll = () => {
      rect = root.getBoundingClientRect();
    };

    if (enabled) {
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      root.style.cursor = "";
    };
  }, [enabled]);

  return (
    <CanvasRoot rootRef={rootRef}>
      <Scene
        svgRef={svgRef}
        groupRef={groupRef}
        initial={initialTransform(COMP_H_02, COMP_W_02, TEXTBLOCK_02)}
      >
        {/* Base structure — always drawn, this is what the card says. */}
        {EDGES_02.map(([a, b], i) => (
          <line
            key={`e${i}`}
            {...trimEdge(NODES_02[a], NODES_02[b], radius02(a), radius02(b))}
          />
        ))}
        {NODES_02.map((n, i) => (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r={radius02(i)} />
        ))}

        {/* Signal layer — cherry copies of every link and node, clear at rest. */}
        {EDGES_02.map(([a, b], i) => (
          <line
            key={`le${i}`}
            ref={(el) => {
              litEdgeRefs.current[i] = el;
            }}
            {...trimEdge(NODES_02[a], NODES_02[b], radius02(a), radius02(b))}
            stroke={CHERRY}
            strokeWidth={LIT_STROKE_02}
            style={{ opacity: 0, willChange: "opacity" }}
          />
        ))}
        {NODES_02.map((n, i) => (
          <circle
            key={`ln${i}`}
            ref={(el) => {
              litNodeRefs.current[i] = el;
            }}
            cx={n.x}
            cy={n.y}
            r={radius02(i)}
            fill={CHERRY}
            stroke={CHERRY}
            style={{ opacity: 0, willChange: "opacity" }}
          />
        ))}
        <circle
          ref={cursorRef}
          cx={0}
          cy={0}
          r={CURSOR_R_02}
          stroke={CHERRY}
          fill="none"
          transform="translate(0 0)"
          style={{
            opacity: 0,
            transition: "opacity 150ms ease",
            willChange: "transform",
          }}
        />
      </Scene>
    </CanvasRoot>
  );
}

// ---------------------------------------------------------------------------
// 03 — Tie user discovery to real business goals.
// Rest: two overlapping outlined circles — the two concerns and the ground
// between them, readable with nothing to hover. Interactive: put the pointer in
// the overlap and the shared ground fills with dollar signs rising through it,
// clipped to the exact intersection — discovery meeting the business case. The
// circles close a little on each other: a short, snappy move, not a shove.
// ---------------------------------------------------------------------------
const VENN_R_03 = 58;
const SEP_REST_03 = 40; // each circle centre sits ±this at rest
const SEP_MIN_03 = 33; // a short close-in, kept light
const CLIP_L_ID_03 = "vp3-clip-l"; // single card-03 instance → stable ids
const CLIP_R_ID_03 = "vp3-clip-r";
// The interaction arms when the pointer is in the shared middle. Sized around
// the rest lens (half-width VENN_R - SEP_REST = 18, half-height ~42).
const MIDDLE_RX_03 = 27;
const MIDDLE_RY_03 = 47;
const CONVERGE_EASE_03 = 0.24; // snappy
const RISE_EASE_03 = 0.2; // snappy reveal of the shared ground
// Dollar signs rising through the lens. Columns are staggered vertically so the
// field reads as texture rather than a marching grid.
// Kept inside the lens half-width (VENN_R - SEP_MIN = 25) so the outer columns
// aren't sliced in half by the clip.
const RISE_COLS_03 = [-14, 0, 14];
const RISE_ROW_H_03 = 30; // vertical gap between glyphs in a column
const RISE_ROWS_03 = 6; // enough to cover the lens plus one wrap
const RISE_SPEED_03 = 0.5; // px/frame upward
const RISE_TOP_03 = -VENN_R_03 - RISE_ROW_H_03;
const GLYPH_SIZE_03 = 17;
const CURSOR_R_03 = 8;
const COMP_H_03 = 132;
const COMP_W_03 = 200;
const TEXTBLOCK_03 = 48;

export function Illus03() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<SVGCircleElement>(null);
  const leftRef = useRef<SVGCircleElement>(null);
  const rightRef = useRef<SVGCircleElement>(null);
  const clipLRef = useRef<SVGCircleElement>(null);
  const clipRRef = useRef<SVGCircleElement>(null);
  const riseRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const cursor = cursorRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const clipL = clipLRef.current;
    const clipR = clipRRef.current;
    const rise = riseRef.current;
    if (
      !root || !svg || !group || !cursor || !left || !right ||
      !clipL || !clipR || !rise
    )
      return;

    let raf = 0;
    let inside = false;
    let settled = true;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { x: 0, y: -70 };
    const tgt = { x: 0, y: -70 };
    let t = 0; // convergence
    let riseOpacity = 0;
    let riseOffset = 0;
    let joined = false;

    const layout = () => {
      const m = measure(root, COMP_H_03, COMP_W_03, TEXTBLOCK_03);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
    };

    const frame = () => {
      cur.x += (tgt.x - cur.x) * K;
      cur.y += (tgt.y - cur.y) * K;
      cursor.setAttribute("transform", `translate(${cur.x} ${cur.y})`);

      // Armed only while the pointer is inside the shared middle.
      const inMiddle =
        inside &&
        (cur.x / MIDDLE_RX_03) ** 2 + (cur.y / MIDDLE_RY_03) ** 2 < 1;
      t += ((inMiddle ? 1 : 0) - t) * CONVERGE_EASE_03;

      const sep = lerp(SEP_REST_03, SEP_MIN_03, t);
      left.setAttribute("cx", (-sep).toFixed(2));
      right.setAttribute("cx", sep.toFixed(2));
      // Two nested clips → the waves show only in the exact intersection.
      clipL.setAttribute("cx", (-sep).toFixed(2));
      clipR.setAttribute("cx", sep.toFixed(2));

      if (inside) {
        riseOffset -= RISE_SPEED_03;
        if (riseOffset <= -RISE_ROW_H_03) riseOffset += RISE_ROW_H_03;
        rise.setAttribute("transform", `translate(0 ${riseOffset.toFixed(2)})`);
      }
      riseOpacity += ((inMiddle ? 1 : 0) - riseOpacity) * RISE_EASE_03;
      rise.style.opacity = riseOpacity.toFixed(3);

      const on = t > 0.5;
      if (on !== joined) {
        joined = on;
        left.setAttribute("stroke", on ? CHERRY : CHARCOAL);
        right.setAttribute("stroke", on ? CHERRY : CHARCOAL);
      }

      settled = !inside && t < 0.004 && riseOpacity < 0.004;
      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const toLocal = (e: PointerEvent) => ({
      x: (e.clientX - rect.left - c.Cx) / c.s,
      y: (e.clientY - rect.top - c.Cy) / c.s,
    });

    const onEnter = (e: PointerEvent) => {
      inside = true;
      settled = false;
      rect = root.getBoundingClientRect();
      const p = toLocal(e);
      cur.x = p.x;
      cur.y = p.y;
      tgt.x = p.x;
      tgt.y = p.y;
      cursor.setAttribute("transform", `translate(${cur.x} ${cur.y})`);
      cursor.style.opacity = "1";
      root.style.cursor = "none";
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      const p = toLocal(e);
      tgt.x = p.x;
      tgt.y = p.y;
    };
    const onLeave = () => {
      inside = false;
      cursor.style.opacity = "0";
      root.style.cursor = "";
      if (!raf) raf = requestAnimationFrame(frame);
    };

    layout();
    const ro = new ResizeObserver(() => {
      rect = root.getBoundingClientRect();
      layout();
    });
    ro.observe(root);
    const onScroll = () => {
      rect = root.getBoundingClientRect();
    };

    if (enabled) {
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      root.style.cursor = "";
    };
  }, [enabled]);

  return (
    <CanvasRoot rootRef={rootRef}>
      <Scene
        svgRef={svgRef}
        groupRef={groupRef}
        initial={initialTransform(COMP_H_03, COMP_W_03, TEXTBLOCK_03)}
      >
        {/* Nested clips: left circle ∩ right circle === the shared ground. */}
        <clipPath id={CLIP_L_ID_03}>
          <circle ref={clipLRef} cx={-SEP_REST_03} cy={0} r={VENN_R_03} />
        </clipPath>
        <clipPath id={CLIP_R_ID_03}>
          <circle ref={clipRRef} cx={SEP_REST_03} cy={0} r={VENN_R_03} />
        </clipPath>
        <g clipPath={`url(#${CLIP_L_ID_03})`}>
          <g clipPath={`url(#${CLIP_R_ID_03})`}>
            <g
              ref={riseRef}
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              {RISE_COLS_03.map((x, col) =>
                Array.from({ length: RISE_ROWS_03 }).map((_, row) => (
                  <text
                    key={`${col}-${row}`}
                    x={x}
                    // Odd columns sit half a row down so the field reads as
                    // texture rather than a marching grid.
                    y={
                      RISE_TOP_03 +
                      row * RISE_ROW_H_03 +
                      (col % 2 ? RISE_ROW_H_03 / 2 : 0)
                    }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={CHERRY}
                    stroke="none"
                    fontSize={GLYPH_SIZE_03}
                    fontFamily="var(--font-jetbrains-mono), monospace"
                  >
                    $
                  </text>
                )),
              )}
            </g>
          </g>
        </g>
        {/* What users need. */}
        <circle
          ref={leftRef}
          cx={-SEP_REST_03}
          cy={0}
          r={VENN_R_03}
          style={{ transition: "stroke 150ms ease", willChange: "cx" }}
        />
        {/* What the business needs. */}
        <circle
          ref={rightRef}
          cx={SEP_REST_03}
          cy={0}
          r={VENN_R_03}
          style={{ transition: "stroke 150ms ease", willChange: "cx" }}
        />
        <circle
          ref={cursorRef}
          cx={0}
          cy={0}
          r={CURSOR_R_03}
          stroke={CHERRY}
          fill="none"
          transform="translate(0 -70)"
          style={{
            opacity: 0,
            transition: "opacity 150ms ease",
            willChange: "transform",
          }}
        />
      </Scene>
    </CanvasRoot>
  );
}
