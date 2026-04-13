import Link from "next/link";
import {
  readDoc,
  type DateId,
  type TaskId,
} from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DocPage({
  params,
}: {
  params: Promise<{ task: TaskId; date: DateId }>;
}) {
  const { task: rawTask, date } = await params;
  const task = decodeURIComponent(rawTask);
  // Legacy route: /tasks/<task>/<date> now maps to /tasks/<task>/<slug>
  const doc = await readDoc(task, date);
  const html = await mdToHtml(doc.body);

  return (
    <main>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>／</span>
        <Link href={`/tasks/${encodeURIComponent(task)}`}>{task}</Link>
        <span>／</span>
        <span className="kbd">{date}</span>
      </div>

      <h1 className="h1" style={{ marginTop: 14 }}>
        {task}
        <span style={{ color: "var(--faint)", fontWeight: 500 }}> — {date}</span>
      </h1>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardTitle">閱讀提示</div>
        <div className="cardKicker">
          這頁內容來自 content repo。若你覺得版面太長，下一步可以加：
          章節目錄、固定側欄、或全文搜尋。
        </div>
      </div>

      <article className="article" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="footerNote">Source: {doc.sourcePath}</div>
    </main>
  );
}
