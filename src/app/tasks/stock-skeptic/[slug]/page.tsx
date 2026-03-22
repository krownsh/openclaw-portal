import Link from "next/link";
import {
  listNestedIndex,
  resolveNestedDocBySlug,
  type SlugId,
} from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-static";

export function generateStaticParams() {
  // De-dupe by slug (if the same slug appears in multiple dates, we keep the newest).
  const items = listNestedIndex("stock-skeptic");
  const seen = new Set<string>();
  const out: Array<{ slug: string }> = [];
  for (const it of items) {
    if (seen.has(it.slug)) continue;
    seen.add(it.slug);
    out.push({ slug: it.slug });
  }
  return out;
}

export default async function StockSkepticSlugPage({
  params,
}: {
  params: Promise<{ slug: SlugId }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const { date, doc } = resolveNestedDocBySlug("stock-skeptic", slug);
  const html = await mdToHtml(doc.body);

  return (
    <main>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>／</span>
        <Link href="/tasks/stock-skeptic">stock-skeptic</Link>
        <span>／</span>
        <span className="kbd">{slug}</span>
      </div>

      <h1 className="h1" style={{ marginTop: 14 }}>
        stock-skeptic
        <span style={{ color: "var(--faint)", fontWeight: 500 }}>
          {" "}— {slug}
        </span>
      </h1>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardTitle">來源</div>
        <div className="cardKicker">
          這篇文章實際存放於：<span className="kbd">{date}</span>
        </div>
      </div>

      <article className="article" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="footerNote">Source: {doc.sourcePath}</div>
    </main>
  );
}
