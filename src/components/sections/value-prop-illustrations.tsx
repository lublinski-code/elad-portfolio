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

// Critically-ish damped spring, stepped per frame. A touch of overshoot is what
// makes a snap read as a snap rather than a slide — plain exponential easing
// always arrives apologetically.
const SPRING_STIFF = 0.2;
const SPRING_DAMP = 0.68;
function spring<T extends string>(
  pos: Record<T, number>,
  vel: Record<T, number>,
  tgt: Record<T, number>,
  key: T,
  stiff = SPRING_STIFF,
  damp = SPRING_DAMP,
) {
  vel[key] = (vel[key] + (tgt[key] - pos[key]) * stiff) * damp;
  pos[key] += vel[key];
}

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
// Rest: a tidy 3x3 grid with one slot still empty and its block sitting loose
// and askew outside — an ordered system, one piece short. Legible with no
// pointer at all. Interactive: the loose block rides your cursor, and bringing
// it near the empty slot snaps it home on a spring with a cherry flash.
// ---------------------------------------------------------------------------
const SQ_02 = 32; // block side
const SQ_RX_02 = 5;
const STEP_02 = 44; // grid pitch
const SLOT_02 = { x: STEP_02, y: STEP_02 }; // the empty one, bottom-right
const CELLS_02 = [-STEP_02, 0, STEP_02].flatMap((y) =>
  [-STEP_02, 0, STEP_02].map((x) => ({ x, y })),
);
const FILLED_02 = CELLS_02.filter(
  (p) => !(p.x === SLOT_02.x && p.y === SLOT_02.y),
);
const PARKED_02 = { x: 84, y: -58, rot: -14 }; // loose block at rest
// Following the cursor wants far less bounce than landing in the slot does —
// at the default damping the block trails you on a visible rubber band.
const FOLLOW_STIFF_02 = 0.3;
const FOLLOW_DAMP_02 = 0.42;
const SNAP_R_02 = 30; // how close before it locks home
const FLASH_SPEED_02 = 0.055; // flash ring phase per frame
// Landing the last piece wakes the whole system: a cherry pulse runs outward
// through the grid from the slot, each block lighting in turn.
const CASCADE_SPEED_02 = 0.03; // phase per frame
const CASCADE_SPREAD_02 = 0.6; // how much of the run is spent travelling out
const CASCADE_W_02 = 0.4; // how long any one block stays lit
const CASCADE_MAX_D_02 = Math.hypot(2 * STEP_02, 2 * STEP_02);
const COMP_H_02 = 150;
const COMP_W_02 = 208;
const TEXTBLOCK_02 = 48;

export function Illus02() {
  const enabled = useAnimateEnabled();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const looseRef = useRef<SVGGElement>(null);
  const looseRectRef = useRef<SVGRectElement>(null);
  const flashRef = useRef<SVGRectElement>(null);
  const litCellRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const group = groupRef.current;
    const loose = looseRef.current;
    const looseRect = looseRectRef.current;
    const flash = flashRef.current;
    if (!root || !svg || !group || !loose || !looseRect || !flash) return;

    let raf = 0;
    let inside = false;
    let snapped = false;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    // Spring state for the loose block — a little overshoot is what makes the
    // snap feel like a snap rather than a slide.
    const pos = { x: PARKED_02.x, y: PARKED_02.y, rot: PARKED_02.rot };
    const vel = { x: 0, y: 0, rot: 0 };
    const tgt = { ...PARKED_02 };
    let flashT = 1; // 1 === spent
    let cascadeT = 2; // > 1 + spread === spent

    const layout = () => {
      const m = measure(root, COMP_H_02, COMP_W_02, TEXTBLOCK_02);
      c = { Cx: m.Cx, Cy: m.Cy, s: m.s };
      svg.setAttribute("viewBox", `0 0 ${m.dims.w} ${m.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
    };

    const setSnapped = (v: boolean) => {
      if (v === snapped) return;
      snapped = v;
      looseRect.setAttribute("stroke", v ? CHERRY : CHARCOAL);
      looseRect.setAttribute("fill", v ? CHERRY : "none");
      if (v) {
        flashT = 0; // fire the ring
        cascadeT = 0; // and wake the grid
      }
    };

    const frame = () => {
      // Where the block wants to be this frame.
      if (inside && snapped) {
        tgt.x = SLOT_02.x;
        tgt.y = SLOT_02.y;
        tgt.rot = 0;
      } else if (!inside) {
        tgt.x = PARKED_02.x;
        tgt.y = PARKED_02.y;
        tgt.rot = PARKED_02.rot;
      }

      // Springy on the way home, near-critically damped while tracking.
      const st = snapped ? SPRING_STIFF : FOLLOW_STIFF_02;
      const dp = snapped ? SPRING_DAMP : FOLLOW_DAMP_02;
      spring(pos, vel, tgt, "x", st, dp);
      spring(pos, vel, tgt, "y", st, dp);
      spring(pos, vel, tgt, "rot", st, dp);
      loose.setAttribute(
        "transform",
        `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)}) rotate(${pos.rot.toFixed(2)})`,
      );

      // Cherry ring blooming out of the slot on the moment it locks in.
      if (flashT < 1) {
        flashT = Math.min(1, flashT + FLASH_SPEED_02);
        const grow = 1 + flashT * 0.7;
        flash.setAttribute("transform", `scale(${grow.toFixed(3)})`);
        flash.style.opacity = (1 - flashT).toFixed(3);
      } else {
        flash.style.opacity = "0";
      }

      // Pulse travelling outward from the slot through the rest of the grid.
      // It keeps looping for as long as the piece is sitting in the slot.
      const cascadeEnd = 1 + CASCADE_SPREAD_02;
      if (snapped) {
        cascadeT += CASCADE_SPEED_02;
        if (cascadeT >= cascadeEnd) cascadeT = 0;
      } else if (cascadeT < cascadeEnd) {
        cascadeT += CASCADE_SPEED_02; // let the last run finish on its own
      }
      for (let i = 0; i < FILLED_02.length; i++) {
        const el = litCellRefs.current[i];
        if (!el) continue;
        if (cascadeT >= cascadeEnd) {
          el.style.opacity = "0";
          continue;
        }
        const d =
          Math.hypot(FILLED_02[i].x - SLOT_02.x, FILLED_02[i].y - SLOT_02.y) /
          CASCADE_MAX_D_02;
        const u = (cascadeT - d * CASCADE_SPREAD_02) / CASCADE_W_02;
        el.style.opacity =
          u > 0 && u < 1 ? Math.sin(u * Math.PI).toFixed(3) : "0";
      }

      const moving =
        snapped ||
        cascadeT < cascadeEnd ||
        Math.abs(vel.x) > 0.02 ||
        Math.abs(vel.y) > 0.02 ||
        Math.abs(vel.rot) > 0.02 ||
        Math.hypot(tgt.x - pos.x, tgt.y - pos.y) > 0.3 ||
        flashT < 1;

      if (inside || moving) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const toLocal = (e: PointerEvent) => ({
      x: (e.clientX - rect.left - c.Cx) / c.s,
      y: (e.clientY - rect.top - c.Cy) / c.s,
    });

    const track = (e: PointerEvent) => {
      const p = toLocal(e);
      const near = Math.hypot(p.x - SLOT_02.x, p.y - SLOT_02.y) < SNAP_R_02;
      setSnapped(near);
      if (!near) {
        tgt.x = p.x;
        tgt.y = p.y;
        tgt.rot = 0;
      }
    };

    const onEnter = (e: PointerEvent) => {
      inside = true;
      rect = root.getBoundingClientRect();
      root.style.cursor = "none";
      track(e);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      track(e);
    };
    const onLeave = () => {
      inside = false;
      setSnapped(false);
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
        {/* The system that already exists. */}
        {FILLED_02.map((p, i) => (
          <rect
            key={`c${i}`}
            x={p.x - SQ_02 / 2}
            y={p.y - SQ_02 / 2}
            width={SQ_02}
            height={SQ_02}
            rx={SQ_RX_02}
          />
        ))}
        {/* Cherry copies — clear at rest, lit as the pulse reaches each block. */}
        {FILLED_02.map((p, i) => (
          <rect
            key={`lc${i}`}
            ref={(el) => {
              litCellRefs.current[i] = el;
            }}
            x={p.x - SQ_02 / 2}
            y={p.y - SQ_02 / 2}
            width={SQ_02}
            height={SQ_02}
            rx={SQ_RX_02}
            stroke={CHERRY}
            fill={CHERRY}
            style={{ opacity: 0, willChange: "opacity" }}
          />
        ))}
        {/* The gap it's waiting on. */}
        <rect
          x={SLOT_02.x - SQ_02 / 2}
          y={SLOT_02.y - SQ_02 / 2}
          width={SQ_02}
          height={SQ_02}
          rx={SQ_RX_02}
          strokeDasharray="5 5"
          opacity={0.55}
        />
        {/* Flash ring, blooming out of the slot the moment the piece lands. */}
        <g transform={`translate(${SLOT_02.x} ${SLOT_02.y})`}>
          <rect
            ref={flashRef}
            x={-SQ_02 / 2}
            y={-SQ_02 / 2}
            width={SQ_02}
            height={SQ_02}
            rx={SQ_RX_02}
            stroke={CHERRY}
            style={{ opacity: 0, willChange: "opacity, transform" }}
          />
        </g>
        {/* The loose piece. */}
        <g
          ref={looseRef}
          transform={`translate(${PARKED_02.x} ${PARKED_02.y}) rotate(${PARKED_02.rot})`}
          style={{ willChange: "transform" }}
        >
          <rect
            ref={looseRectRef}
            x={-SQ_02 / 2}
            y={-SQ_02 / 2}
            width={SQ_02}
            height={SQ_02}
            rx={SQ_RX_02}
            style={{ transition: "fill 120ms ease, stroke 120ms ease" }}
          />
        </g>
      </Scene>
    </CanvasRoot>
  );
}

// ---------------------------------------------------------------------------
// 03 — Tie user discovery to real business goals.
// Rest: two overlapping circles — the two concerns and the shared ground
// between them. Interactive: reach the middle and the two snap together into a
// single circle on a spring.
// ---------------------------------------------------------------------------
const VENN_R_03 = 58;
const SEP_REST_03 = 36; // each circle centre sits ±this at rest
// The shared ground is the intersection of the two circles, so the same clip
// grows from a narrow lens at rest to the whole circle once they merge.
const CLIP_L_ID_03 = "vp3-clip-l";
const CLIP_R_ID_03 = "vp3-clip-r";
// The field has to overrun the circle on every side, otherwise the clip shows
// bare gaps at the edges. Columns run past ±VENN_R, and the rows extend a full
// wrap below the bottom so nothing empties out as the field scrolls up.
const RISE_COLS_03 = [-55, -33, -11, 11, 33, 55];
const RISE_ROW_H_03 = 28;
// Each column flies at its own rate so the field breaks formation and reads as
// coins being shot upward, rather than one rigid sheet sliding by. Every column
// still wraps on RISE_WRAP, which is what keeps each coin's size stable.
const RISE_SPEEDS_03 = [1.2, 1.6, 1.35, 1.75, 1.45, 1.1]; // px/frame, per column
// The field wraps every RISE_PERIOD rows rather than every single row, and the
// size pattern repeats on exactly that period. Keying size to the raw row index
// made each coin jump to its neighbour's size at every wrap, which read as the
// coins resizing mid-flight.
const RISE_PERIOD_03 = 2;
const RISE_WRAP_03 = RISE_PERIOD_03 * RISE_ROW_H_03;
const RISE_TOP_03 = -VENN_R_03 - RISE_WRAP_03;
const RISE_ROWS_03 =
  Math.ceil((2 * VENN_R_03 + 2 * RISE_WRAP_03) / RISE_ROW_H_03) + 1;
// Mixed sizes so it reads as loose change rather than a printed grid.
const COIN_SIZES_03 = [8, 5.5, 7, 9, 6, 7.5];
const coinR03 = (col: number, row: number) =>
  COIN_SIZES_03[
    (col * 5 + (row % RISE_PERIOD_03) * 7) % COIN_SIZES_03.length
  ];
const MIDDLE_RX_03 = 26;
const MIDDLE_RY_03 = 42;
const CURSOR_R_03 = 8;
const COMP_H_03 = 124;
const COMP_W_03 = 196;
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
  const riseColRefs = useRef<(SVGGElement | null)[]>([]);

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
    if (!root || !svg || !group || !cursor || !left || !right) return;
    if (!clipL || !clipR || !rise) return;

    let raf = 0;
    let inside = false;
    let joined = false;
    let c: Center = { Cx: D.w / 2, Cy: 0, s: 1 };
    let rect = root.getBoundingClientRect();
    const cur = { x: 0, y: -70 };
    const tgt = { x: 0, y: -70 };
    // Spring so the two land together with a little snap instead of gliding.
    const m = { t: 0 };
    const mv = { t: 0 };
    const mt = { t: 0 };
    const riseOffsets = RISE_COLS_03.map(() => 0);

    const layout = () => {
      const mm = measure(root, COMP_H_03, COMP_W_03, TEXTBLOCK_03);
      c = { Cx: mm.Cx, Cy: mm.Cy, s: mm.s };
      svg.setAttribute("viewBox", `0 0 ${mm.dims.w} ${mm.dims.h}`);
      group.setAttribute("transform", `translate(${c.Cx} ${c.Cy}) scale(${c.s})`);
    };

    const frame = () => {
      cur.x += (tgt.x - cur.x) * K;
      cur.y += (tgt.y - cur.y) * K;
      cursor.setAttribute("transform", `translate(${cur.x} ${cur.y})`);

      const inMiddle =
        inside &&
        (cur.x / MIDDLE_RX_03) ** 2 + (cur.y / MIDDLE_RY_03) ** 2 < 1;
      mt.t = inMiddle ? 1 : 0;
      spring(m, mv, mt, "t");
      const t = clamp(m.t, 0, 1.15); // allow a touch of overshoot

      // Circles ride all the way together — at t=1 they are one circle.
      const sep = lerp(SEP_REST_03, 0, t);
      left.setAttribute("cx", (-sep).toFixed(2));
      right.setAttribute("cx", sep.toFixed(2));
      clipL.setAttribute("cx", (-sep).toFixed(2));
      clipR.setAttribute("cx", sep.toFixed(2));

      if (inside) {
        for (let i = 0; i < riseOffsets.length; i++) {
          riseOffsets[i] -= RISE_SPEEDS_03[i % RISE_SPEEDS_03.length];
          if (riseOffsets[i] <= -RISE_WRAP_03) riseOffsets[i] += RISE_WRAP_03;
          const el = riseColRefs.current[i];
          if (el) {
            el.setAttribute(
              "transform",
              `translate(0 ${riseOffsets[i].toFixed(2)})`,
            );
          }
        }
      }
      rise.style.opacity = clamp(m.t, 0, 1).toFixed(3);

      // Once the two are one, the ring would just sit between the marks and
      // compete with them — so it retires as the merge completes.
      if (inside) cursor.style.opacity = clamp(1 - m.t * 1.4, 0, 1).toFixed(3);

      const on = m.t > 0.5;
      if (on !== joined) {
        joined = on;
        left.setAttribute("stroke", on ? CHERRY : CHARCOAL);
        right.setAttribute("stroke", on ? CHERRY : CHARCOAL);
      }

      const moving = Math.abs(mv.t) > 0.0015 || Math.abs(mt.t - m.t) > 0.002;
      if (inside || moving) {
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
        {/* Shared ground — grows from the rest lens to the whole merged circle. */}
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
              {RISE_COLS_03.map((x, col) => (
                <g
                  key={col}
                  ref={(el) => {
                    riseColRefs.current[col] = el;
                  }}
                  style={{ willChange: "transform" }}
                >
                  {Array.from({ length: RISE_ROWS_03 }).map((_, row) => (
                    <circle
                      key={row}
                      cx={x}
                      cy={
                        RISE_TOP_03 +
                        row * RISE_ROW_H_03 +
                        (col % 2 ? RISE_ROW_H_03 / 2 : 0)
                      }
                      r={coinR03(col, row)}
                      fill={CHERRY}
                      stroke="none"
                    />
                  ))}
                </g>
              ))}
            </g>
          </g>
        </g>
        {/* Who you're designing for. */}
        <circle
          ref={leftRef}
          cx={-SEP_REST_03}
          cy={0}
          r={VENN_R_03}
          style={{ transition: "stroke 120ms ease", willChange: "cx" }}
        />
        {/* What the business needs. */}
        <circle
          ref={rightRef}
          cx={SEP_REST_03}
          cy={0}
          r={VENN_R_03}
          style={{ transition: "stroke 120ms ease", willChange: "cx" }}
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
