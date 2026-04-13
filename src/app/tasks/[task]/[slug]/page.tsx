import Link from "next/link";
import { readDoc, type SlugId, type TaskId } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DocBySlugPage({
  params,
}: {
  params: Promise<{ task: TaskId; slug: SlugId }>;
}) {
  const { task: rawTask, slug: rawSlug } = await params;
  const task = decodeURIComponent(rawTask);
  const slug = decodeURIComponent(rawSlug);

  const doc = await readDoc(task, slug);
  const html = await mdToHtml(doc.body);

  return (
    <main>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>／</span>
        <Link href={`/tasks/${encodeURIComponent(task)}`}>{task}</Link>
        <span>／</span>
        <span className="kbd">{slug}</span>
      </div>

      <h1 className="h1" style={{ marginTop: 14 }}>
        {task}
        <span style={{ color: "var(--faint)", fontWeight: 500 }}>
          {" "}— {doc.title || slug}
        </span>
      </h1>

      <article className="article" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="footerNote">Source: {doc.sourcePath}</div>
    </main>
  );
}

