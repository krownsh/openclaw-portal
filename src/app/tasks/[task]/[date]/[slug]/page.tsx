import { redirect } from "next/navigation";
import { type DateId, type TaskId } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function NestedDocPage({
  params,
}: {
  params: Promise<{ task: TaskId; date: DateId; slug: string }>;
}) {
  const { task: rawTask, date, slug: rawSlug } = await params;
  const task = decodeURIComponent(rawTask);
  const slug = decodeURIComponent(rawSlug);

  // Legacy: /tasks/<task>/<date>/<slug> -> /tasks/<task>/<slug>
  redirect(`/tasks/${encodeURIComponent(task)}/${encodeURIComponent(slug)}`);
}
