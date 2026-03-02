import { remark } from "remark";
import html from "remark-html";

export async function mdToHtml(markdown: string): Promise<string> {
  const file = await remark().use(html).process(markdown);
  return String(file);
}
