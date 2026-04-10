import { notFound } from "next/navigation";
import {
  getAllWorkMeta,
  getAllWorkSlugs,
  getWorkBySlug,
} from "@/lib/content";
import WorkPage from "@/components/work/work-page";
import WorkPageMeta from "@/components/work/work-page-meta";

export async function generateStaticParams() {
  const slugs = await getAllWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const all = await getAllWorkMeta();
  const idx = all.findIndex((w) => w.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <WorkPageMeta title={work.title} />
      <WorkPage
        work={work}
        prev={prev ? { slug: prev.slug, title: prev.title } : null}
        next={next ? { slug: next.slug, title: next.title } : null}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: `${work.title} — Elad Lublinski`,
    description: work.subtitle,
  };
}
