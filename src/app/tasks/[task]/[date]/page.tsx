import Link from "next/link";
import { listDates, listTasks, readDoc, type DateId, type TaskId } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-static";

export function generateStaticParams() {
  const tasks = listTasks();
  const out: Array<{ task: string; date: string }> = [];
  for (const task of tasks) {
    for (const date of listDates(task)) {
      out.push({ task, date });
    }
  }
  return out;
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ task: TaskId; date: DateId }>;
}) {
  const { task: rawTask, date } = await params;
  const task = decodeURIComponent(rawTask);
  const doc = readDoc(task, date);
  const html = await mdToHtml(doc.body);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <p>
        <Link href="/">Home</Link> / <Link href={`/tasks/${encodeURIComponent(task)}`}>{task}</Link>
      </p>
      <h1>
        {task} — {date}
      </h1>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
        Source: {doc.sourcePath}
      </div>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
