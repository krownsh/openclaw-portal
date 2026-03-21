import Link from "next/link";
import {
  listDates,
  listTasks,
  listSlugs,
  readNestedDoc,
  type DateId,
  type TaskId,
} from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-static";

export function generateStaticParams() {
  const tasks = listTasks();
  const out: Array<{ task: string; date: string; slug: string }> = [];

  for (const task of tasks) {
    for (const date of listDates(task)) {
      for (const slug of listSlugs(task, date)) {
        out.push({ task, date, slug });
      }
    }
  }

  return out;
}

export default async function NestedDocPage({
  params,
}: {
  params: Promise<{ task: TaskId; date: DateId; slug: string }>;
}) {
  const { task: rawTask, date, slug: rawSlug } = await params;
  const task = decodeURIComponent(rawTask);
  const slug = decodeURIComponent(rawSlug);

  const doc = readNestedDoc(task, date, slug);
  const html = await mdToHtml(doc.body);

  return (
    <main>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>／</span>
        <Link href={`/tasks/${encodeURIComponent(task)}`}>{task}</Link>
        <span>／</span>
        <Link href={`/tasks/${encodeURIComponent(task)}/${date}`}>{date}</Link>
        <span>／</span>
        <span className="kbd">{slug}</span>
      </div>

      <h1 className="h1" style={{ marginTop: 14 }}>
        {task}
        <span style={{ color: "var(--faint)", fontWeight: 500 }}>
          {" "}— {date} — {slug}
        </span>
      </h1>

      <article className="article" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="footerNote">Source: {doc.sourcePath}</div>
    </main>
  );
}
