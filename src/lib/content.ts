import fs from "node:fs";
import path from "node:path";

export type TaskId = string;
export type DateId = string; // YYYY-MM-DD

export type ContentDoc = {
  task: TaskId;
  date: DateId;
  body: string;
  sourcePath: string;
};

export type SlugId = string;

export type NestedContentDoc = {
  task: TaskId;
  date: DateId;
  slug: SlugId;
  body: string;
  sourcePath: string;
};

/**
 * The content repo is cloned during build into the portal repo.
 *
 * Expected path:
 *   <portal-repo>/content_repo/content/<task>/<YYYY-MM-DD>.md
 */
export function contentRoot(): string {
  return path.join(process.cwd(), "content_repo", "content");
}

export function listTasks(): TaskId[] {
  const root = contentRoot();
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function listDates(task: TaskId): DateId[] {
  const dir = path.join(contentRoot(), task);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/i, ""))
    .sort()
    .reverse();
}

export function readDoc(task: TaskId, date: DateId): ContentDoc {
  const file = path.join(contentRoot(), task, `${date}.md`);
  const body = fs.readFileSync(file, "utf8");
  return { task, date, body, sourcePath: file };
}

/**
 * Optional nested docs:
 *   <content>/<task>/<date>/<slug>.md
 */
export function listSlugs(task: TaskId, date: DateId): SlugId[] {
  const dir = path.join(contentRoot(), task, date);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/i, ""))
    .sort()
    .reverse();
}

export function readNestedDoc(
  task: TaskId,
  date: DateId,
  slug: SlugId,
): NestedContentDoc {
  const file = path.join(contentRoot(), task, date, `${slug}.md`);
  const body = fs.readFileSync(file, "utf8");
  return { task, date, slug, body, sourcePath: file };
}
