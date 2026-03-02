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
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <p>
        <Link href="/">← Home</Link>
      </p>
      <h1>{task}</h1>

      {dates.length === 0 ? (
        <p style={{ opacity: 0.8 }}>此 task 目前沒有任何內容。</p>
      ) : (
        <ul style={{ lineHeight: 1.8 }}>
          {dates.map((d) => (
            <li key={d}>
              <Link href={`/tasks/${encodeURIComponent(task)}/${d}`}>{d}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
