import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import type { MitarashiConfig } from "types";

export async function indexBuilder(markdownFiles: string[],config: MitarashiConfig, rootDir: string) {
  const outputRoot = path.resolve(rootDir, config.paths.outputDir);
  const postsDir = path.resolve(rootDir, config.paths.postsDir);
  const baseUrl = config.site.baseUrl || "/";

  // フロントマターを解析して一覧データを生成
  const posts = await Promise.all(
    markdownFiles.map(async (markdownFile) => {
      const raw = await fs.readFile(markdownFile, "utf-8");
      const parsed = matter(raw);

      const title = parsed.data.title;
      const date = parsed.data.date;

      const relativePath = path
        .relative(postsDir, markdownFile)
        .replace(/\.md$/, ".html")
        .split(path.sep)
        .join("/");
      const href = baseUrl.endsWith("/")
        ? `${baseUrl}${relativePath}`
        : `${baseUrl}/${relativePath}`;

      return { title, date: date, href };
    })
  );

  // 日付があるものは新しい順にソート（未設定は最後）
  posts.sort((a, b) => {
    if (a.date && b.date) {
      const ad = new Date(a.date).getTime();
      const bd = new Date(b.date).getTime();
      return bd - ad;
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  const postsListHtml = posts
    .map((p) => {
      const datePart = p.date ? ` <time datetime="${p.date}">${p.date}</time>` : "";
      return `<li><a href="${p.href}">${p.title}</a>${datePart}</li>`;
    })
    .join("\n");

  const indexTemplatePath = path.resolve(
    config.paths.templateDir,
    "index.html"
  );
  const indexTemplate = await fs.readFile(indexTemplatePath, "utf-8");
  const indexHtml = indexTemplate.replaceAll("{{ posts }}", postsListHtml);

  const layoutTemplatePath = path.resolve(
    config.paths.templateDir,
    config.theme.layout
  );
  const layoutTemplate = await fs.readFile(layoutTemplatePath, "utf-8");
  const pageHtml = layoutTemplate
    .replaceAll("{{ siteTitle }}", config.site.siteTitle || "my site")
    .replaceAll("{{ slot }}", indexHtml);

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(path.join(outputRoot, "index.html"), pageHtml, "utf-8");
}
