import Link from "next/link";
import {
  resolveNestedDocBySlug,
  type SlugId,
} from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function StockSkepticSlugPage({
  params,
}: {
  params: Promise<{ slug: SlugId }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const { date, doc } = await resolveNestedDocBySlug("stock-skeptic", slug);
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
