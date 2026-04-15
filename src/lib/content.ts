import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const WORK_DIR = path.join(process.cwd(), "src", "content", "work");

export type WorkColor =
  | "grape"
  | "lime"
  | "sunflower"
  | "sky"
  | "mint"
  | "candy"
  | "lemon"
  | "lavender"
  | "sprite"
  | "pineapple"
  | "iceberg"
  | "peppermint"
  | "marshmello"
  | "lemonade";

/** Accent name used in frontmatter (vivid colors only) */
export type WorkAccent =
  | "grape"
  | "lime"
  | "sunflower"
  | "sky"
  | "mint"
  | "candy"
  | "lemon";

/** Maps vivid accent name to raw hex (for reliable inline styles) */
const accentToVividHex: Record<WorkAccent, string> = {
  grape: "#6b2ed6",
  lime: "#399946",
  sunflower: "#f5c015",
  sky: "#507dff",
  mint: "#00d8ad",
  candy: "#e800a7",
  lemon: "#54e100",
};

/** Maps vivid accent name to its pastel hex counterpart */
const accentToPastelHex: Record<WorkAccent, string> = {
  grape: "#dfd2f6",
  lime: "#d5f1d9",
  sunflower: "#fbe9ab",
  sky: "#d9e3ff",
  mint: "#b4f6e9",
  candy: "#ffd0f2",
  lemon: "#d4ffba",
};

/** Get the vivid hex for an accent */
export const workAccentVivid = (accent: WorkAccent): string =>
  accentToVividHex[accent];

/** Get the pastel hex for an accent */
export const workAccentPastel = (accent: WorkAccent): string =>
  accentToPastelHex[accent];

export type WorkCategory = "Case Study" | "Side Project" | "Personal";

export type WorkLink = {
  label: string;
  href: string;
  icon?: string;
  variant?: "primary" | "secondary";
};

export type WorkMeta = {
  slug: string;
  title: string;
  navLabel: string;
  subtitle: string;
  category: WorkCategory;
  tags: string[];
  timeline: string;
  role: string;
  team: string;
  impact: string;
  bg: WorkColor;
  fg: "black" | "white";
  order: number;
  published: boolean;
  links?: WorkLink[];
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
    navLabel: String(data.navLabel ?? data.title ?? "Untitled"),
    subtitle: String(data.subtitle ?? ""),
    category: (data.category as WorkCategory) ?? "Case Study",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    timeline: String(data.timeline ?? ""),
    role: String(data.role ?? ""),
    team: String(data.team ?? ""),
    impact: String(data.impact ?? ""),
    bg: (data.bg as WorkColor) ?? "lavender",
    fg: (data.fg as "black" | "white") ?? "black",
    order: Number(data.order ?? 999),
    published: data.published !== false,
    links: Array.isArray(data.links) ? (data.links as WorkLink[]) : undefined,
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
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  return { ...meta, bodyHtml: String(processed) };
}

export async function getAdjacentWork(
  slug: string,
): Promise<{ next: WorkMeta | null; prev: WorkMeta | null }> {
  const all = await getAllWorkMeta();
  const idx = all.findIndex((w) => w.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const all = await getAllWorkMeta();
  return all.map((w) => w.slug);
}

/** CSS color value for a WorkColor */
export const workColorVar = (c: WorkColor) => `var(--${c})`;
