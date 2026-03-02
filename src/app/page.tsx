import Link from "next/link";
import { listTasks } from "@/lib/content";

export const dynamic = "force-static";

export default function HomePage() {
  const tasks = listTasks();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>OpenClaw Portal</h1>
      <p style={{ opacity: 0.8 }}>
        集中閱讀各子任務產物（內容來源：content repo build-time clone）。
      </p>

      {tasks.length === 0 ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p>
            找不到任何 tasks。請確認 build 時已 clone content repo 到
            <code> content_repo/</code>，且存在
            <code> content/&lt;task&gt;/YYYY-MM-DD.md</code>。
          </p>
        </div>
      ) : (
        <ul style={{ marginTop: 16, lineHeight: 1.8 }}>
          {tasks.map((t) => (
            <li key={t}>
              <Link href={`/tasks/${encodeURIComponent(t)}`}>{t}</Link>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "24px 0" }} />
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Tip: 你之後可以加 /search、tags、RSS、或把每個 task 的 index 做成
        calendar view。
      </p>
    </main>
  );
}
