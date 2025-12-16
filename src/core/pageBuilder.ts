import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import parser from "./parser";
import astTransformer from "./astTransformer";
import generator from "./generator";
import type { MitarashiConfig } from "../types";

export async function pageBuilder(markdownPath: string, config: MitarashiConfig, rootDir: string){
  try{
    const markdown = await fs.readFile(markdownPath, "utf-8");
    const parsed = matter(markdown);

    // 記事情報
    const ast = parser(parsed.content);
    const transformedAst = astTransformer(ast, rootDir, config);
    const contentHtml = generator(transformedAst, rootDir, config);
    const title = parsed.data.title;
    const date = parsed.data.date;

    // テンプレートファイルを読み込み
    const layoutTemplatePath = path.resolve(config.paths.templateDir, config.theme.layout);
    const layoutTemplate = await fs.readFile(layoutTemplatePath, 'utf-8');
    
    const articleTemplatePath = path.resolve(config.paths.templateDir, config.theme.post);
    const articleTemplate = await fs.readFile(articleTemplatePath, 'utf-8');

    // 出力パスを計算
    const outputRoot = path.resolve(rootDir, config.paths.outputDir);
    const postsDir = path.resolve(rootDir, config.paths.postsDir);
    const relativePath = path.relative(postsDir, markdownPath).replace(/\.md$/, '.html');
    const outputPath = path.join(outputRoot, relativePath);

    // index.htmlへの相対パスを計算
    const pathToIndex = path.relative(
      path.dirname(outputPath),
      path.join(outputRoot, 'index.html')
    );

    // データ差し込み
    const articleReplaced = articleTemplate
      .replaceAll('{{ title }}', title || 'Untitled')
      .replaceAll('{{ date }}', date || 'Undated')
      .replaceAll('{{ content }}', contentHtml || '');

    const pageHtml = layoutTemplate
      .replaceAll('{{ siteTitle }}', config.site.siteTitle || 'my site')
      .replaceAll('{{ pathToIndex }}', pathToIndex)
      .replaceAll('{{ slot }}', articleReplaced);
    await fs.mkdir(path.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, pageHtml, 'utf-8');
  }catch(e){
    throw new Error(`Markdownファイルの読み込みに失敗しました: ${e}`);
  }
}