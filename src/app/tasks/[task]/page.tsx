import Link from "next/link";
import { listSlugs, type TaskId } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function TaskIndexPage({
  params,
}: {
  params: Promise<{ task: TaskId }>;
}) {
  const { task: rawTask } = await params;
  const task = decodeURIComponent(rawTask);

  // Default UI: slug index (date is just a filename, not a routing segment)
  const slugs = await listSlugs(task);

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

      <>
        <div className="h2">選一篇內容進去看完整報告。</div>

        {slugs.length === 0 ? (
          <div className="card" style={{ marginTop: 18 }}>
            <div className="cardTitle">此 task 目前沒有任何內容</div>
            <div className="cardKicker">
              你可以先確認資料庫是否有內容，或 content-sync 是否有成功 upsert。
            </div>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {slugs.map((s) => (
              <Link key={s} className="card" href={`/tasks/${encodeURIComponent(task)}/${encodeURIComponent(s)}`}>
                <div className="cardTitle">{s}</div>
                <div className="cardKicker">開啟單篇報告</div>
              </Link>
            ))}
          </div>
        )}

        <div className="footerNote">
          快捷：你也可以直接打網址 <span className="kbd">/tasks/{task}/&lt;slug&gt;</span>
        </div>
      </>
    </main>
  );
}
