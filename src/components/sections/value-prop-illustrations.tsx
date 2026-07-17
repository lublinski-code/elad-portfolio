"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Value-prop card illustrations. Each is a card-filling, cursor-driven scene.
 *
 * Every scene is a COMPLETE, legible static line drawing on its own — the
 * pointer interactivity is layered on top and is never required to read the
 * card. Interactivity is gated behind `(hover: hover) and (pointer: fine)` and
 * disabled under `prefers-reduced-motion: reduce`; on touch / no-hover / reduced
 * motion the static drawing renders and the OS cursor is never hidden.
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
const EASE = "cubic-bezier(0.32,0.72,0,1)";
const STATE_TRANSITION = `transform 150ms ${EASE}, fill 150ms ease, stroke 150ms ease`;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

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
  baseScale = 1,
): Center {
  const band = textTop - numberBottom;
  return {
    Cx: dims.w / 2,
    Cy: numberBottom + 0.45 * band,
    s: clamp((band - 16) / compHeight, 0.62, 1) * baseScale,
  };
}

/** Read the real card DOM to place the composition. Falls back to constants. */
function measure(
  root: HTMLDivElement,
  compHeight: number,
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
    ...computeCenter(dims, numberBottom, textTop, compHeight, baseScale),
  };
}

/** Deterministic transform for SSR + first client paint (no hydration diff). */
function initialTransform(
  compHeight: number,
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
      className="h-full w-full"
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
// 01 — Discover what to solve before what to build.
// Static: 7 outlined "problem" circles + a magnifier at rest, all offsets from
// the composition center. Interactive: the OS cursor hides and the magnifier
// BECOMES the cursor (lens centre = pointer, turns cherry). The nearest circle
// within reach of the lens fills cherry + enlarges; it reverts when the lens
// leaves. The cluster circles never move.
// ---------------------------------------------------------------------------
const CIRCLES_01: { x: number; y: number; r: number }[] = [
  { x: -87.7, y: 13.7, r: 9 },
  { x: -51.3, y: -7.2, r: 9 },
  { x: -39.9, y: 33.1, r: 7 },
  { x: -11.6, y: 4.3, r: 9 },
  { x: -11.7, y: -37.5, r: 7 },
  { x: 20.4, y: -19.1, r: 9 },
  { x: 31.2, y: 32.6, r: 9 },
];
const GLASS_REST_01 = { x: 66, y: -18.6 }; // lens centre offset
const LENS_R_01 = 20;
const HIT_PAD_01 = 17;
const COMP_H_01 = 84;
const TEXTBLOCK_01 = 52;

export function Illus01() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const glassRef = useRef<SVGGElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const glass = glassRef.current;
    if (!root || !svg || !group || !glass) return;

    let raf = 0;
    let inside = false;
    let settled = true;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { ...GLASS_REST_01 };
    const tgt = { ...GLASS_REST_01 };
    let activeIdx = -1;

    const placeGlass = (x: number, y: number) =>
      glass.setAttribute("transform", `translate(${x} ${y})`);

    const setActive = (idx: number) => {
      if (idx === activeIdx) return;
      const prev = circleRefs.current[activeIdx];
      if (prev) {
        prev.setAttribute("fill", "none");
        prev.setAttribute("stroke", CHARCOAL);
        prev.style.transform = "scale(1)";
      }
      activeIdx = idx;
      const el = circleRefs.current[activeIdx];
      if (el) {
        el.setAttribute("fill", CHERRY);
        el.setAttribute("stroke", CHERRY);
        el.style.transform = "scale(1.25)";
      }
    };

    const layout = () => {
      const m = measure(root, COMP_H_01, TEXTBLOCK_01);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
      if (!inside && settled) {
        cur.x = GLASS_REST_01.x;
        cur.y = GLASS_REST_01.y;
        placeGlass(cur.x, cur.y);
      }
    };

    const frame = () => {
      const target = inside ? tgt : GLASS_REST_01;
      cur.x += (target.x - cur.x) * K;
      cur.y += (target.y - cur.y) * K;
      placeGlass(cur.x, cur.y);

      if (inside) {
        let best = -1;
        let bestD = Infinity;
        for (let i = 0; i < CIRCLES_01.length; i++) {
          const cc = CIRCLES_01[i];
          const d = Math.hypot(cc.x - cur.x, cc.y - cur.y);
          if (d < cc.r + HIT_PAD_01 && d < bestD) {
            bestD = d;
            best = i;
          }
        }
        setActive(best);
      } else {
        setActive(-1);
      }

      settled = !inside && Math.hypot(target.x - cur.x, target.y - cur.y) < 0.5;
      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        placeGlass(target.x, target.y);
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
      glass.setAttribute("stroke", CHERRY);
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
      glass.setAttribute("stroke", CHARCOAL);
      setActive(-1);
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
        initial={initialTransform(COMP_H_01, TEXTBLOCK_01)}
      >
        {CIRCLES_01.map((cc, i) => (
          <circle
            key={i}
            ref={(el) => {
              circleRefs.current[i] = el;
            }}
            cx={cc.x}
            cy={cc.y}
            r={cc.r}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transition: STATE_TRANSITION,
            }}
          />
        ))}
        <g
          ref={glassRef}
          transform={`translate(${GLASS_REST_01.x} ${GLASS_REST_01.y})`}
          style={{ willChange: "transform" }}
        >
          <circle cx={0} cy={0} r={LENS_R_01} />
          <line x1={14} y1={14.6} x2={29} y2={34.6} />
        </g>
      </Scene>
    </CanvasRoot>
  );
}

// ---------------------------------------------------------------------------
// 02 — Users click through real code, not mockups.
// Static: an outlined browser window (title-bar divider, 3 traffic dots, one
// pill button) + a resting arrow cursor, all offsets from the window centre.
// Interactive: the OS cursor hides, the arrow follows (tip = hotspot, cherry
// stroke, cream fill). When the tip enters the button, the pill fills cherry.
// ---------------------------------------------------------------------------
const WIN_02 = { w: 200, h: 121, rx: 8 };
const DIVIDER_Y_02 = -45;
const DOT_Y_02 = -51;
const DOTS_X_02 = [-90, -82, -74];
const BTN_02 = { cx: -1, cy: 24, w: 88, h: 28 };
const ARROW_REST_02 = { x: 92, y: 69 }; // arrow tip offset
// Arrow pointer with its tip at the group origin (0,0), ~25 x 38.
const ARROW_PATH_02 = "M0 0 L0 34 L8 26 L13.5 38 L19 35 L13.5 23.5 L25 23.5 Z";
const COMP_H_02 = 121;
const TEXTBLOCK_02 = 52;
const BASE_02 = 0.72; // window reads too large at 1:1 — scale the whole scene down

export function Illus02() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const btnRef = useRef<SVGRectElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const btn = btnRef.current;
    const arrow = arrowRef.current;
    if (!root || !svg || !group || !btn || !arrow) return;

    let raf = 0;
    let inside = false;
    let settled = true;
    let over = false;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { ...ARROW_REST_02 };
    const tgt = { ...ARROW_REST_02 };

    const placeArrow = (x: number, y: number) =>
      arrow.setAttribute("transform", `translate(${x} ${y})`);

    const setOver = (v: boolean) => {
      if (v === over) return;
      over = v;
      btn.setAttribute("fill", v ? CHERRY : "none");
      btn.setAttribute("stroke", v ? CHERRY : CHARCOAL);
    };

    const layout = () => {
      const m = measure(root, COMP_H_02, TEXTBLOCK_02, BASE_02);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
      if (!inside && settled) {
        cur.x = ARROW_REST_02.x;
        cur.y = ARROW_REST_02.y;
        placeArrow(cur.x, cur.y);
      }
    };

    const frame = () => {
      const target = inside ? tgt : ARROW_REST_02;
      cur.x += (target.x - cur.x) * K;
      cur.y += (target.y - cur.y) * K;
      placeArrow(cur.x, cur.y);

      if (inside) {
        setOver(
          Math.abs(cur.x - BTN_02.cx) < BTN_02.w / 2 &&
            Math.abs(cur.y - BTN_02.cy) < BTN_02.h / 2,
        );
      } else {
        setOver(false);
      }

      settled = !inside && Math.hypot(target.x - cur.x, target.y - cur.y) < 0.5;
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
        initial={initialTransform(COMP_H_02, TEXTBLOCK_02, BASE_02)}
      >
        <rect
          x={-WIN_02.w / 2}
          y={-WIN_02.h / 2}
          width={WIN_02.w}
          height={WIN_02.h}
          rx={WIN_02.rx}
        />
        <line
          x1={-WIN_02.w / 2}
          y1={DIVIDER_Y_02}
          x2={WIN_02.w / 2}
          y2={DIVIDER_Y_02}
        />
        {DOTS_X_02.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={DOT_Y_02}
            r={2}
            fill={CHARCOAL}
            stroke="none"
          />
        ))}
        <rect
          ref={btnRef}
          x={BTN_02.cx - BTN_02.w / 2}
          y={BTN_02.cy - BTN_02.h / 2}
          width={BTN_02.w}
          height={BTN_02.h}
          rx={BTN_02.h / 2}
          style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
        />
        <g
          ref={arrowRef}
          transform={`translate(${ARROW_REST_02.x} ${ARROW_REST_02.y})`}
          style={{ willChange: "transform" }}
        >
          <path d={ARROW_PATH_02} fill={CREAM} />
        </g>
      </Scene>
    </CanvasRoot>
  );
}

// ---------------------------------------------------------------------------
// 03 — I build discovery workflows tuned to how your team works.
// Static: 8 outer circles ringed around 1 hub, no lines. Interactive: the OS
// cursor hides and becomes a hollow cherry ring. Drop the ring into the hub and
// the workflow "connects": 8 spokes appear, the hub fills cherry, and the outer
// ring orbits continuously (ease-in). Leaving unwinds it (ease-out).
// ---------------------------------------------------------------------------
const HUB_R_03 = 21.5;
const OUTER_R_03 = 13.5;
const OUTER_03: { x: number; y: number }[] = [
  { x: 63, y: 0 },
  { x: 44.5, y: 44.5 },
  { x: 0, y: 63 },
  { x: -44.5, y: 44.5 },
  { x: -63, y: 0 },
  { x: -44.5, y: -44.5 },
  { x: 0, y: -63 },
  { x: 44.5, y: -44.5 },
];
const CURSOR_RING_R_03 = 12.5;
const ORBIT_SPEED_03 = 0.6; // target deg/frame
const ORBIT_ACCEL_03 = 0.04; // ease-in/out of the spin
const COMP_H_03 = 154;
const TEXTBLOCK_03 = 78;

export function Illus03() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const orbitRef = useRef<SVGGElement>(null);
  const hubRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const spokeRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const orbit = orbitRef.current;
    const hub = hubRef.current;
    const ring = ringRef.current;
    if (!root || !svg || !group || !orbit || !hub || !ring) return;

    let raf = 0;
    let inside = false;
    let active = false;
    let angle = 0;
    let speed = 0;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const placeRing = (x: number, y: number) =>
      ring.setAttribute("transform", `translate(${x} ${y})`);

    const setActive = (v: boolean) => {
      if (v === active) return;
      active = v;
      hub.setAttribute("fill", v ? CHERRY : "none");
      spokeRefs.current.forEach((s) => {
        if (s) s.style.opacity = v ? "1" : "0";
      });
    };

    const layout = () => {
      const m = measure(root, COMP_H_03, TEXTBLOCK_03);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
    };

    const frame = () => {
      if (inside) {
        cur.x += (tgt.x - cur.x) * K;
        cur.y += (tgt.y - cur.y) * K;
        placeRing(cur.x, cur.y);
      }

      setActive(inside && Math.hypot(cur.x, cur.y) < HUB_R_03);

      const targetSpeed = active ? ORBIT_SPEED_03 : 0;
      speed += (targetSpeed - speed) * ORBIT_ACCEL_03;
      angle += speed;
      orbit.setAttribute("transform", `rotate(${angle})`);

      if (inside || Math.abs(speed) > 0.005) {
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
      rect = root.getBoundingClientRect();
      const p = toLocal(e);
      cur.x = p.x;
      cur.y = p.y;
      tgt.x = p.x;
      tgt.y = p.y;
      placeRing(cur.x, cur.y);
      ring.style.opacity = "1";
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
      ring.style.opacity = "0";
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
        initial={initialTransform(COMP_H_03, TEXTBLOCK_03)}
      >
        <g ref={orbitRef}>
          {OUTER_03.map((o, i) => {
            const dist = Math.hypot(o.x, o.y);
            const sf = HUB_R_03 / dist; // start at the hub edge
            const ef = 1 - OUTER_R_03 / dist; // stop at the outer circle edge
            return (
              <line
                key={`s${i}`}
                ref={(el) => {
                  spokeRefs.current[i] = el;
                }}
                x1={o.x * sf}
                y1={o.y * sf}
                x2={o.x * ef}
                y2={o.y * ef}
                style={{ opacity: 0, transition: "opacity 200ms ease" }}
              />
            );
          })}
          {OUTER_03.map((o, i) => (
            <circle key={`c${i}`} cx={o.x} cy={o.y} r={OUTER_R_03} />
          ))}
        </g>
        <circle
          ref={hubRef}
          cx={0}
          cy={0}
          r={HUB_R_03}
          style={{ transition: "fill 150ms ease" }}
        />
        <circle
          ref={ringRef}
          cx={0}
          cy={0}
          r={CURSOR_RING_R_03}
          stroke={CHERRY}
          fill="none"
          transform="translate(0 0)"
          style={{ opacity: 0, transition: "opacity 150ms ease", willChange: "transform" }}
        />
      </Scene>
    </CanvasRoot>
  );
}
