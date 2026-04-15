import { getAllWorkMeta } from "@/lib/content";
import InnerBottomNav from "./inner-bottom-nav";

export default async function InnerBottomNavServer() {
  const items = await getAllWorkMeta();
  return (
    <InnerBottomNav
      items={items.map((w) => ({ slug: w.slug, navLabel: w.navLabel, bg: w.bg }))}
    />
  );
}
