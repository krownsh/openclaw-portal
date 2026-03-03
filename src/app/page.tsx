import Link from "next/link";
import { listTasks } from "@/lib/content";

export const dynamic = "force-static";

function prettyTask(task: string) {
  return task
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

export default function HomePage() {
  const tasks = listTasks();

  return (
    <main>
      <h1 className="h1">任務書櫥</h1>
      <div className="h2">
        所有 cron 產物集中到同一個 Portal；LINE 只提醒 + 連結。
      </div>

      {tasks.length === 0 ? (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="cardTitle">找不到任何內容</div>
          <div className="cardKicker">
            請確認 build 時已 clone content repo 到 <span className="kbd">content_repo/</span>，
            並存在 <span className="kbd">content/&lt;task&gt;/YYYY-MM-DD.md</span>。
          </div>
        </div>
      ) : (
        <div className="grid">
          {tasks.map((t) => (
            <Link className="card" key={t} href={`/tasks/${encodeURIComponent(t)}`}>
              <div className="cardTitle">
                {prettyTask(t)}
                <span className="kbd">{t}</span>
              </div>
              <div className="cardKicker">
                點進去看日期列表 → 再進單篇。之後可加搜尋 / tags / RSS。
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="footerNote">
        Tip：建議 task slug 永久化（不要改名），不然既有連結會失效。
      </div>
    </main>
  );
}
