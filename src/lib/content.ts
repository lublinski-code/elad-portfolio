import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const WORK_DIR = path.join(process.cwd(), "src", "content", "work");

export type WorkColor =
  | "lemon"
  | "grape"
  | "cloud"
  | "daffodil"
  | "orange"
  | "mint"
  | "candy"
  | "lime"
  | "lavender"
  | "iceberg"
  | "pineapple"
  | "papaya"
  | "peppermint"
  | "marshmallow";

/** Accent name used in frontmatter (vivid colors only) */
export type WorkAccent =
  | "lemon"
  | "grape"
  | "cloud"
  | "daffodil"
  | "orange"
  | "mint"
  | "candy";

/** Maps vivid accent name to raw hex (for reliable inline styles) */
const accentToVividHex: Record<WorkAccent, string> = {
  lemon: "#5dfa00",
  grape: "#726cff",
  cloud: "#50a9ff",
  daffodil: "#fdff00",
  orange: "#ee6d35",
  mint: "#00f1c1",
  candy: "#ff02b8",
};

/** Maps vivid accent name to its pastel hex counterpart */
const accentToPastelHex: Record<WorkAccent, string> = {
  lemon: "#dcfedd",
  grape: "#e2d5ff",
  cloud: "#daefff",
  daffodil: "#fdf0bb",
  orange: "#fbd0c2",
  mint: "#d9f9f9",
  candy: "#ffd0f2",
};

/** Get the vivid hex for an accent */
export const workAccentVivid = (accent: WorkAccent): string =>
  accentToVividHex[accent];

/** Get the pastel hex for an accent */
export const workAccentPastel = (accent: WorkAccent): string =>
  accentToPastelHex[accent];

export type WorkCategory = "Case Study" | "Side Project" | "Personal";

export type WorkMeta = {
  slug: string;
  title: string;
  subtitle: string;
  category: WorkCategory;
  tags: string[];
  bg: WorkColor;
  fg: "black" | "white";
  order: number;
  published: boolean;
};

export type Work = WorkMeta & {
  bodyHtml: string;
};

async function readFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(WORK_DIR);
    return entries.filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

function parseMeta(slug: string, data: Record<string, unknown>): WorkMeta {
  return {
    slug,
    title: String(data.title ?? "Untitled"),
    subtitle: String(data.subtitle ?? ""),
    category: (data.category as WorkCategory) ?? "Case Study",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    bg: (data.bg as WorkColor) ?? "lavender",
    fg: (data.fg as "black" | "white") ?? "black",
    order: Number(data.order ?? 999),
    published: data.published !== false,
  };
}

export async function getAllWorkMeta(): Promise<WorkMeta[]> {
  const files = await readFiles();
  const items = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = await fs.readFile(path.join(WORK_DIR, file), "utf-8");
      const { data } = matter(raw);
      return parseMeta(slug, data);
    }),
  );
  return items
    .filter((w) => w.published)
    .sort((a, b) => a.order - b.order);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const file = path.join(WORK_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const meta = parseMeta(slug, data);
  if (!meta.published) return null;
  const processed = await remark().use(html).process(content);
  return { ...meta, bodyHtml: String(processed) };
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const all = await getAllWorkMeta();
  return all.map((w) => w.slug);
}

/** CSS color value for a WorkColor */
export const workColorVar = (c: WorkColor) => `var(--${c})`;
