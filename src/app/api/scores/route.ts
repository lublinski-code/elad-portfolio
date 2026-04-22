import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const preferredRegion = "fra1";

if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL (or KV_REST_API_URL) env var");
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN && !process.env.KV_REST_API_TOKEN) {
  throw new Error("Missing UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_TOKEN) env var");
}

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
  try {
    const raw = (await redis.zrange(KEY, 0, 5, {
      rev: true,
      withScores: true,
    })) as (string | number)[];
    return NextResponse.json(parseRaw(raw));
  } catch (err) {
    console.error("[/api/scores] GET failed", err);
    return new Response("internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let body: { name?: unknown; score?: unknown };
    try {
      body = (await req.json()) as { name?: unknown; score?: unknown };
    } catch {
      return new Response("invalid json", { status: 400 });
    }
    const rawName = typeof body.name === "string" ? body.name : "";
    const name = rawName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3)
      .padEnd(3, "?");
    const score = body.score as number;
    if (!Number.isFinite(score) || !Number.isInteger(score) || score < 0 || score > 10_000_000) {
      return new Response("bad request", { status: 400 });
    }
    await redis.zadd(KEY, { score, member: `${name}:${Date.now()}` });
    const raw = (await redis.zrange(KEY, 0, 5, {
      rev: true,
      withScores: true,
    })) as (string | number)[];
    return NextResponse.json(parseRaw(raw));
  } catch (err) {
    console.error("[/api/scores] POST failed", err);
    return new Response("internal error", { status: 500 });
  }
}
