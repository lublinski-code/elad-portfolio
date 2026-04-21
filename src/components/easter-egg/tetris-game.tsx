"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "./tetris.css";

const COLS = 10;
const ROWS = 20;
const CS = 20;
const SCORES = [0, 100, 300, 500, 800];

type PieceKey = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

const PIECE_COLOR_VAR: Record<PieceKey, string> = {
  I: "--mint",
  O: "--sunflower",
  T: "--grape",
  S: "--lime",
  Z: "--cherry",
  J: "--sky",
  L: "--candy",
};

const PIECES: Record<PieceKey, { cells: [number, number][]; w: number }> = {
  I: { cells: [[0, 1], [1, 1], [2, 1], [3, 1]], w: 4 },
  O: { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], w: 3 },
  T: { cells: [[1, 0], [0, 1], [1, 1], [2, 1]], w: 3 },
  S: { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], w: 3 },
  Z: { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], w: 3 },
  J: { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], w: 3 },
  L: { cells: [[2, 0], [0, 1], [1, 1], [2, 1]], w: 3 },
};
const PKEYS = Object.keys(PIECES) as PieceKey[];

type Piece = { key: PieceKey; cells: [number, number][]; w: number; x: number; y: number };

function readColors() {
  const root = getComputedStyle(document.documentElement);
  const pieces: Record<PieceKey, string> = {} as Record<PieceKey, string>;
  (Object.keys(PIECE_COLOR_VAR) as PieceKey[]).forEach((k) => {
    pieces[k] = root.getPropertyValue(PIECE_COLOR_VAR[k]).trim();
  });
  return {
    pieces,
    bg: root.getPropertyValue("--cream").trim() || "#f5f0eb",
    empty: "rgba(0, 0, 0, 0.06)",
    ghost: "rgba(0, 0, 0, 0.08)",
  };
}

function newBoard(): number[][] {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function newPiece(): Piece {
  const key = PKEYS[Math.floor(Math.random() * PKEYS.length)];
  const def = PIECES[key];
  return { key, w: def.w, x: 3, y: 0, cells: def.cells.map(([x, y]) => [x, y]) };
}

function rotate(p: Piece): [number, number][] {
  const w = p.w;
  return p.cells.map(([x, y]) => [w - 1 - y, x]);
}

function valid(
  board: number[][],
  cells: [number, number][],
  ox: number,
  oy: number,
): boolean {
  return cells.every(([x, y]) => {
    const nx = x + ox;
    const ny = y + oy;
    if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
    if (ny < 0) return true;
    return !board[ny][nx];
  });
}

function ghostY(board: number[][], cur: Piece): number {
  let g = cur.y;
  while (valid(board, cur.cells, cur.x, g + 1)) g++;
  return g;
}

type GameState = "idle" | "playing" | "naming" | "dead";

export default function TetrisGame() {
  const boardCanvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<number[][]>(newBoard());
  const curRef = useRef<Piece | null>(null);
  const nextRef = useRef<Piece | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const colorsRef = useRef<ReturnType<typeof readColors> | null>(null);

  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  const drawBlock = useCallback(
    (ctx: CanvasRenderingContext2D, gx: number, gy: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(gx * CS + 1, gy * CS + 1, CS - 2, CS - 2, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    },
    [],
  );

  const drawAll = useCallback(() => {
    const bc = boardCanvasRef.current;
    const nc = nextCanvasRef.current;
    if (!bc || !nc) return;
    const bx = bc.getContext("2d");
    const nx = nc.getContext("2d");
    if (!bx || !nx) return;
    if (!colorsRef.current) colorsRef.current = readColors();
    const colors = colorsRef.current;

    bx.fillStyle = colors.bg;
    bx.fillRect(0, 0, COLS * CS, ROWS * CS);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = boardRef.current[r][c];
        if (v) {
          drawBlock(bx, c, r, colors.pieces[PKEYS[v - 1]]);
        } else {
          bx.fillStyle = colors.empty;
          bx.beginPath();
          bx.roundRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2, 3);
          bx.fill();
        }
      }
    }

    const cur = curRef.current;
    if (cur) {
      const gy = ghostY(boardRef.current, cur);
      if (gy !== cur.y) {
        cur.cells.forEach(([x, y]) => {
          if (y + gy >= 0) drawBlock(bx, x + cur.x, y + gy, colors.ghost);
        });
      }
      cur.cells.forEach(([x, y]) => {
        if (y + cur.y >= 0) drawBlock(bx, x + cur.x, y + cur.y, colors.pieces[cur.key]);
      });
    }

    nx.fillStyle = colors.bg;
    nx.fillRect(0, 0, 120, 80);
    const next = nextRef.current;
    if (next) {
      const ox = Math.floor((6 - next.w) / 2);
      next.cells.forEach(([x, y]) => drawBlock(nx, x + ox, y + 1, colors.pieces[next.key]));
    }
  }, [drawBlock]);

  const pieceIndex = useCallback((k: PieceKey) => PKEYS.indexOf(k) + 1, []);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setState("dead");
  }, []);

  const animateClear = useCallback(
    (rows: number[], onDone: () => void) => {
      const bc = boardCanvasRef.current;
      if (!bc) { onDone(); return; }
      const bx = bc.getContext("2d");
      if (!bx) { onDone(); return; }
      if (!colorsRef.current) colorsRef.current = readColors();

      // Pause game loop during animation
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;

      const start = performance.now();
      const PHASE_MS = [80, 60, 80, 60]; // flash-white, color, flash-white, fade
      const TOTAL = PHASE_MS.reduce((a, b) => a + b, 0); // 280ms

      const drawFlashRow = (r: number, fill: string, alpha: number) => {
        bx.globalAlpha = alpha;
        bx.fillStyle = fill;
        for (let c = 0; c < COLS; c++) {
          bx.beginPath();
          bx.roundRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2, 3);
          bx.fill();
        }
        bx.globalAlpha = 1;
      };

      const frame = (now: number) => {
        const elapsed = now - start;
        drawAll(); // redraw base each frame so overlay is on top of current state

        if (elapsed < PHASE_MS[0]) {
          rows.forEach((r) => drawFlashRow(r, "#ffffff", 1));
        } else if (elapsed < PHASE_MS[0] + PHASE_MS[1]) {
          // brief return to piece color (already drawn by drawAll)
        } else if (elapsed < PHASE_MS[0] + PHASE_MS[1] + PHASE_MS[2]) {
          rows.forEach((r) => drawFlashRow(r, "#ffffff", 1));
        } else if (elapsed < TOTAL) {
          const p = (elapsed - PHASE_MS[0] - PHASE_MS[1] - PHASE_MS[2]) / PHASE_MS[3];
          rows.forEach((r) => drawFlashRow(r, "#ffffff", 1 - p));
        } else {
          onDone();
          return;
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },
    [drawAll],
  );

  const tickRef = useRef<() => void>(() => {});

  const place = useCallback(() => {
    const cur = curRef.current;
    if (!cur) return;
    cur.cells.forEach(([x, y]) => {
      if (y + cur.y >= 0) boardRef.current[y + cur.y][x + cur.x] = pieceIndex(cur.key);
    });

    // Find full rows first (don't mutate yet)
    const fullRows: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (boardRef.current[r].every((c) => c)) fullRows.push(r);
    }

    const finishAfterClear = () => {
      // Actually mutate the board now that the animation is done
      const kept = boardRef.current.filter((_, r) => !fullRows.includes(r));
      while (kept.length < ROWS) kept.unshift(new Array(COLS).fill(0));
      boardRef.current = kept;

      const cleared = fullRows.length;
      if (cleared) {
        setLines((prev) => {
          const newLines = prev + cleared;
          setLevel(Math.floor(newLines / 10) + 1);
          return newLines;
        });
        setScore((prev) => prev + SCORES[Math.min(cleared, 4)] * level);
      }
      curRef.current = nextRef.current;
      nextRef.current = newPiece();
      if (curRef.current && !valid(boardRef.current, curRef.current.cells, curRef.current.x, curRef.current.y)) {
        endGame();
        return;
      }
      // Resume loop after animation
      if (state === "playing") {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => tickRef.current(), Math.max(80, 650 - level * 50));
      }
      drawAll();
    };

    if (fullRows.length > 0) {
      animateClear(fullRows, finishAfterClear);
    } else {
      curRef.current = nextRef.current;
      nextRef.current = newPiece();
      if (curRef.current && !valid(boardRef.current, curRef.current.cells, curRef.current.x, curRef.current.y)) {
        endGame();
        return;
      }
      drawAll();
    }
  }, [animateClear, drawAll, endGame, level, pieceIndex, state]);

  tickRef.current = useCallback(() => {
    const cur = curRef.current;
    if (!cur) return;
    if (!valid(boardRef.current, cur.cells, cur.x, cur.y + 1)) {
      place();
    } else {
      cur.y++;
      drawAll();
    }
  }, [drawAll, place]);

  const startGame = useCallback(() => {
    boardRef.current = newBoard();
    curRef.current = newPiece();
    nextRef.current = newPiece();
    setScore(0);
    setLevel(1);
    setLines(0);
    setState("playing");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => tickRef.current(), Math.max(80, 650 - 1 * 50));
    drawAll();
  }, [drawAll]);

  useEffect(() => {
    drawAll();
  }, [drawAll]);

  useEffect(() => {
    if (state !== "playing" || !timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => tickRef.current(), Math.max(80, 650 - level * 50));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, level]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state === "idle" || state === "dead") {
        if (e.code === "Space" || e.code === "Enter") {
          const inp = document.getElementById("te-name-inp") as HTMLInputElement | null;
          if (inp && document.activeElement === inp) return;
          startGame();
          e.preventDefault();
        }
        return;
      }
      if (state !== "playing") return;
      const cur = curRef.current;
      if (!cur) return;

      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        if (valid(boardRef.current, cur.cells, cur.x - 1, cur.y)) cur.x--;
        drawAll();
        e.preventDefault();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        if (valid(boardRef.current, cur.cells, cur.x + 1, cur.y)) cur.x++;
        drawAll();
        e.preventDefault();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        if (valid(boardRef.current, cur.cells, cur.x, cur.y + 1)) {
          cur.y++;
          drawAll();
        } else {
          place();
        }
        e.preventDefault();
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        const orig = cur.cells.map(([x, y]) => [x, y] as [number, number]);
        const rotated = rotate(cur);
        cur.cells = rotated;
        if (!valid(boardRef.current, cur.cells, cur.x, cur.y)) {
          if (valid(boardRef.current, cur.cells, cur.x + 1, cur.y)) cur.x++;
          else if (valid(boardRef.current, cur.cells, cur.x - 1, cur.y)) cur.x--;
          else cur.cells = orig;
        }
        drawAll();
        e.preventDefault();
      } else if (e.code === "Space") {
        while (valid(boardRef.current, cur.cells, cur.x, cur.y + 1)) cur.y++;
        place();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, startGame, drawAll, place]);

  return (
    <div className="te-wrap">
      <div className="te-stats">
        <span><strong>{score}</strong>score</span>
        <span><strong>{level}</strong>level</span>
        <span><strong>{lines}</strong>lines</span>
      </div>
      <div className="te-stage">
        <div className="te-left">
          <div className="te-board-wrap">
            <canvas
              ref={boardCanvasRef}
              className="te-board"
              width={COLS * CS}
              height={ROWS * CS}
            />
            {state !== "playing" && (
              <div className="te-overlay">
                <p className="te-ol-title">Tetris</p>
                <p className="te-ol-sub">
                  ← → move &nbsp; ↑ rotate
                  <br />↓ soft drop &nbsp; space drop
                  <br />space or enter to start
                </p>
                <div className="te-btn-row">
                  <button className="te-btn te-btn-primary" onClick={startGame}>
                    Play
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="te-right">
          <div>
            <p className="te-panel-label">next</p>
            <canvas ref={nextCanvasRef} className="te-next" width={120} height={80} />
          </div>
          <div>
            <p className="te-panel-label">high scores</p>
            <div>
              <p className="te-lb-empty">no scores yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
