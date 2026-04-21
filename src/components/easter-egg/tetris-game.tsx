"use client";

import { useEffect, useRef } from "react";
import "./tetris.css";

const COLS = 10;
const ROWS = 20;
const CS = 20;

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

function readColors() {
  const root = getComputedStyle(document.documentElement);
  const colors: Record<PieceKey, string> = {} as Record<PieceKey, string>;
  (Object.keys(PIECE_COLOR_VAR) as PieceKey[]).forEach((k) => {
    colors[k] = root.getPropertyValue(PIECE_COLOR_VAR[k]).trim();
  });
  return {
    pieces: colors,
    bg: root.getPropertyValue("--cream").trim() || "#f5f0eb",
    empty: "rgba(0, 0, 0, 0.06)",
    ghost: "rgba(0, 0, 0, 0.08)",
  };
}

export default function TetrisGame() {
  const boardCanvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bc = boardCanvasRef.current;
    if (!bc) return;
    const bx = bc.getContext("2d");
    if (!bx) return;
    const colors = readColors();
    bx.fillStyle = colors.bg;
    bx.fillRect(0, 0, COLS * CS, ROWS * CS);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bx.fillStyle = colors.empty;
        bx.beginPath();
        bx.roundRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2, 3);
        bx.fill();
      }
    }
  }, []);

  return (
    <div className="te-wrap">
      <div className="te-stats">
        <span>
          <strong>0</strong>score
        </span>
        <span>
          <strong>1</strong>level
        </span>
        <span>
          <strong>0</strong>lines
        </span>
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
