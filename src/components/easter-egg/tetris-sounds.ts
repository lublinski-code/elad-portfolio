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

    const blip = (freq: number, dur: number, gain: number, startOffset = 0) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + startOffset);
      g.gain.setValueAtTime(0, now + startOffset);
      g.gain.linearRampToValueAtTime(gain, now + startOffset + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + startOffset + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + dur);
    };

    const fatBlip = (freq: number, dur: number, gain: number, startOffset = 0) => {
      blip(freq, dur, gain * 0.75, startOffset);
      blip(freq * 1.005, dur, gain * 0.5, startOffset);
    };

    const sweep = (f1: number, f2: number, dur: number, gain: number, startOffset = 0) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f1, now + startOffset);
      osc.frequency.exponentialRampToValueAtTime(f2, now + startOffset + dur);
      g.gain.setValueAtTime(0, now + startOffset);
      g.gain.linearRampToValueAtTime(gain, now + startOffset + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + startOffset + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + dur);
    };

    const arp = (freqs: number[], stepMs: number, dur: number, gain: number) => {
      const step = stepMs / 1000;
      freqs.forEach((f, i) => fatBlip(f, dur, gain, i * step));
    };

    switch (event) {
      case "move":
        sweep(520, 660, 0.04, 0.09);
        break;
      case "drop":
        sweep(180, 90, 0.08, 0.18);
        blip(90, 0.05, 0.1, 0.05);
        break;
      case "clear1":
        arp([523.25, 659.25, 783.99], 45, 0.09, 0.11);
        break;
      case "clear2":
        arp([587.33, 739.99, 880.0], 45, 0.09, 0.12);
        break;
      case "clear3":
        arp([659.25, 830.61, 987.77], 45, 0.1, 0.13);
        break;
      case "tetris":
        arp([523.25, 659.25, 783.99, 1046.5, 1318.51], 55, 0.12, 0.14);
        fatBlip(1568.0, 0.25, 0.16, 0.3);
        break;
      case "levelup":
        arp([440, 554.37, 659.25, 880.0], 40, 0.1, 0.12);
        fatBlip(1108.73, 0.22, 0.14, 0.18);
        break;
      case "gameover":
        sweep(520, 260, 0.18, 0.16);
        sweep(330, 165, 0.28, 0.14, 0.2);
        break;
    }
  }
}

let instance: TetrisSounds | null = null;
export function getSounds() {
  if (!instance) instance = new TetrisSounds();
  return instance;
}
