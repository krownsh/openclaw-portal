import { redirect } from "next/navigation";
import { type DateId, type TaskId } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DocPage({
  params,
}: {
  params: Promise<{ task: TaskId; date: DateId }>;
}) {
  const { task: rawTask, date } = await params;
  const task = decodeURIComponent(rawTask);
  // Legacy: /tasks/<task>/<date> -> /tasks/<task>/<slug>
  // Here "date" is just a filename-style slug (e.g. 2026-04-13)
  redirect(`/tasks/${encodeURIComponent(task)}/${encodeURIComponent(date)}`);
}
