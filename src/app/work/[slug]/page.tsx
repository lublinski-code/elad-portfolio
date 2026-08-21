import { notFound } from "next/navigation";
import { getAllWorkSlugs, getWorkBySlug, getAdjacentWork } from "@/lib/content";
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

  const adjacent = await getAdjacentWork(slug);

  return (
    <>
      <WorkPageMeta title={work.title} />
      <WorkPage work={work} nextWork={adjacent.next} />
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
    title: `${work.title} - Elad Lublinski`,
    description: work.subtitle,
  };
}
