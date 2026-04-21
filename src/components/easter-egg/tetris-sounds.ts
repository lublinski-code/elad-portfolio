export type SoundEvent =
  | "move"
  | "drop"
  | "clear1"
  | "clear2"
  | "clear3"
  | "tetris"
  | "levelup"
  | "gameover";

const STORAGE_KEY = "tetris-sound";

class TetrisSounds {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private listeners = new Set<(on: boolean) => void>();

  constructor() {
    if (typeof window !== "undefined") {
      this.enabled = localStorage.getItem(STORAGE_KEY) === "on";
    }
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {}
    if (on && !this.ctx && typeof window !== "undefined") {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    this.listeners.forEach((fn) => fn(on));
  }

  subscribe(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  play(event: SoundEvent) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const tone = (
      freq: number,
      dur: number,
      type: OscillatorType,
      gain: number,
      start = 0,
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain, now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur);
    };

    const slide = (
      f1: number,
      f2: number,
      dur: number,
      type: OscillatorType,
      gain: number,
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + dur);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gain, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    };

    switch (event) {
      case "move":
        tone(440, 0.04, "square", 0.05);
        break;
      case "drop":
        slide(120, 80, 0.09, "sine", 0.15);
        break;
      case "clear1":
        tone(659.25, 0.09, "triangle", 0.1);
        tone(783.99, 0.09, "triangle", 0.1, 0.09);
        break;
      case "clear2":
        tone(783.99, 0.09, "triangle", 0.11);
        tone(987.77, 0.09, "triangle", 0.11, 0.09);
        break;
      case "clear3":
        tone(987.77, 0.09, "triangle", 0.12);
        tone(1174.66, 0.09, "triangle", 0.12, 0.09);
        break;
      case "tetris":
        tone(523.25, 0.1, "triangle", 0.18, 0);
        tone(659.25, 0.1, "triangle", 0.18, 0.1);
        tone(783.99, 0.1, "triangle", 0.18, 0.2);
        tone(1046.5, 0.14, "triangle", 0.2, 0.3);
        break;
      case "levelup":
        tone(523.25, 0.1, "sine", 0.12, 0);
        tone(659.25, 0.1, "sine", 0.12, 0.1);
        tone(783.99, 0.14, "sine", 0.14, 0.2);
        break;
      case "gameover":
        tone(440, 0.2, "sine", 0.13, 0);
        tone(349.23, 0.2, "sine", 0.13, 0.2);
        tone(261.63, 0.3, "sine", 0.13, 0.4);
        break;
    }
  }
}

let instance: TetrisSounds | null = null;
export function getSounds() {
  if (!instance) instance = new TetrisSounds();
  return instance;
}
