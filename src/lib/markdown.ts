import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export async function mdToHtml(markdown: string): Promise<string> {
  // NOTE: Tables are a GFM extension; without remark-gfm they will not render as <table>.
  const file = await remark().use(remarkGfm).use(html).process(markdown);
  return String(file);
}
