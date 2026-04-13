import { supabaseClient, contentTable } from "@/lib/supabase";

export type TaskId = string;
export type DateId = string; // legacy, may still exist in old slugs/frontmatter
export type SlugId = string;

export type ContentDoc = {
  task: TaskId;
  slug: SlugId;
  body: string;
  sourcePath: string;
  title?: string | null;
};

export type NestedContentDoc = {
  task: TaskId;
  slug: SlugId;
  body: string;
  sourcePath: string;
  title?: string | null;
};

export type IndexedNestedDoc = {
  task: TaskId;
  slug: SlugId;
  title: string;
  sourcePath: string;
};

type Row = {
  source_path: string;
  task: string;
  slug: string;
  title: string | null;
  content_md: string;
  deleted_at: string | null;
};

function sb() {
  return supabaseClient();
}

function table() {
  return contentTable();
}

export async function listTasks(): Promise<TaskId[]> {
  const client = sb();
  const { data, error } = await client
    .from(table())
    .select("task")
    .is("deleted_at", null);

  if (error) throw new Error(error.message);
  const tasks = Array.from(new Set((data ?? []).map((r: any) => String(r.task))));
  tasks.sort();
  return tasks;
}

/**
 * Legacy helper. We no longer drive routing off dates.
 * For compatibility, we return a reverse-sorted list of distinct YYYY-MM-DD
 * found in slugs (e.g. 2026-04-10) or source_path.
 */
export async function listDates(task: TaskId): Promise<DateId[]> {
  const client = sb();
  const { data, error } = await client
    .from(table())
    .select("slug,source_path")
    .eq("task", task)
    .is("deleted_at", null)
    .limit(2000);

  if (error) throw new Error(error.message);
  const re = /\b\d{4}-\d{2}-\d{2}\b/;
  const dates = new Set<string>();
  for (const r of (data ?? []) as any[]) {
    const m1 = String(r.slug ?? "").match(re);
    const m2 = String(r.source_path ?? "").match(re);
    if (m1?.[0]) dates.add(m1[0]);
    else if (m2?.[0]) dates.add(m2[0]);
  }
  return Array.from(dates).sort().reverse();
}

export async function readDoc(task: TaskId, slug: SlugId): Promise<ContentDoc> {
  const client = sb();
  const { data, error } = await client
    .from(table())
    .select("source_path,task,slug,title,content_md,deleted_at")
    .eq("task", task)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Doc not found: ${task}/${slug}`);
  const row = data as Row;
  return {
    task: row.task,
    slug: row.slug,
    title: row.title,
    body: row.content_md,
    sourcePath: row.source_path,
  };
}

/**
 * In the DB model, "nested" docs are just docs.
 * We keep these helpers so pages compile with minimal edits.
 */
export async function listSlugs(task: TaskId, _date?: DateId): Promise<SlugId[]> {
  const client = sb();
  const { data, error } = await client
    .from(table())
    .select("slug")
    .eq("task", task)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => String(r.slug));
}

export async function readNestedDoc(
  task: TaskId,
  _date: DateId,
  slug: SlugId,
): Promise<NestedContentDoc> {
  const doc = await readDoc(task, slug);
  return { task: doc.task, slug: doc.slug, title: doc.title, body: doc.body, sourcePath: doc.sourcePath };
}

export async function listNestedIndex(task: TaskId): Promise<IndexedNestedDoc[]> {
  const client = sb();
  const { data, error } = await client
    .from(table())
    .select("task,slug,title,source_path")
    .eq("task", task)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({
    task: String(r.task),
    slug: String(r.slug),
    title: String(r.title ?? r.slug),
    sourcePath: String(r.source_path),
  }));
}

export async function resolveNestedDocBySlug(
  task: TaskId,
  slug: SlugId,
): Promise<{ date: DateId; doc: NestedContentDoc }> {
  // "date" no longer exists. Return empty string for compatibility.
  const doc = await readDoc(task, slug);
  return { date: "" as DateId, doc };
}

