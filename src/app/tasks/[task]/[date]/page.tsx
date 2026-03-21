import Link from "next/link";
import {
  listDates,
  listTasks,
  listSlugs,
  readDoc,
  type DateId,
  type TaskId,
} from "@/lib/content";
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
  const slugs = listSlugs(task, date);

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

      {slugs.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardTitle">同日多篇（nested）</div>
          <div className="cardKicker">
            這個日期底下還有 {slugs.length} 篇子報告：
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {slugs.map((s) => (
              <Link
                key={s}
                className="kbd"
                href={`/tasks/${encodeURIComponent(task)}/${date}/${encodeURIComponent(s)}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      <article className="article" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="footerNote">Source: {doc.sourcePath}</div>
    </main>
  );
}
