import Link from "next/link";
import { listDates, listTasks, type TaskId } from "@/lib/content";

export const dynamic = "force-static";

export function generateStaticParams() {
  return listTasks().map((task) => ({ task }));
}

export default async function TaskIndexPage({
  params,
}: {
  params: Promise<{ task: TaskId }>;
}) {
  const { task: rawTask } = await params;
  const task = decodeURIComponent(rawTask);

  const dates = listDates(task);

  return (
    <main>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>／</span>
        <span className="kbd">{task}</span>
      </div>

      <h1 className="h1" style={{ marginTop: 14 }}>
        {task}
      </h1>
      <div className="h2">選一個日期進去看完整報告。</div>

      {dates.length === 0 ? (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="cardTitle">此 task 目前沒有任何內容</div>
          <div className="cardKicker">
            你可以先確認 content repo 是否有新增
            <span className="kbd">content/{task}/YYYY-MM-DD.md</span>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {dates.map((d) => (
            <Link
              key={d}
              className="card"
              href={`/tasks/${encodeURIComponent(task)}/${d}`}
            >
              <div className="cardTitle">{d}</div>
              <div className="cardKicker">開啟單篇報告</div>
            </Link>
          ))}
        </div>
      )}

      <div className="footerNote">
        快捷：你也可以直接打網址
        <span className="kbd">/tasks/{task}/YYYY-MM-DD</span>
      </div>
    </main>
  );
}
