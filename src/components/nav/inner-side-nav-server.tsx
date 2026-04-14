import { getAllWorkMeta } from "@/lib/content";
import InnerSideNav from "./inner-side-nav";

export default async function InnerSideNavServer() {
  const items = await getAllWorkMeta();
  return (
    <InnerSideNav
      items={items.map((w) => ({ slug: w.slug, navLabel: w.navLabel, bg: w.bg }))}
    />
  );
}
