import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const preferredRegion = "fra1";

const redis = Redis.fromEnv();
const KEY = "tetris:scores";

type ScoreEntry = { name: string; score: number };

function parseRaw(raw: (string | number)[]): ScoreEntry[] {
  const out: ScoreEntry[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    out.push({
      name: String(raw[i]).split(":")[0],
      score: Number(raw[i + 1]),
    });
  }
  return out;
}

export async function GET() {
  const raw = (await redis.zrange(KEY, 0, 5, {
    rev: true,
    withScores: true,
  })) as (string | number)[];
  return NextResponse.json(parseRaw(raw));
}

export async function POST(req: Request) {
  const body = (await req.json()) as { name?: unknown; score?: unknown };
  const rawName = typeof body.name === "string" ? body.name : "";
  const name = rawName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3)
    .padEnd(3, "?");
  const score = body.score;
  if (typeof score !== "number" || score < 0 || score > 10_000_000) {
    return new Response("bad request", { status: 400 });
  }
  await redis.zadd(KEY, { score, member: `${name}:${Date.now()}` });
  const raw = (await redis.zrange(KEY, 0, 5, {
    rev: true,
    withScores: true,
  })) as (string | number)[];
  return NextResponse.json(parseRaw(raw));
}
