import parser from "./parser";
import generator from "./generator";
import path from "path";
import fs from "fs/promises";
import { loadCondig } from "./loadConfig";
import { findMarkdownFiles } from "./findMarkdownFiles";

export async function buildSite(rootDir: string){
  // 設定読み込み
  const config = await loadCondig(rootDir);

  // 出力ディレクトリを初期化
  const outputDir = path.resolve(rootDir, config.paths.outputDir);
  if(config.options.cleanOutputDir){
    await fs.rm(outputDir, {recursive: true, force: true})
  }

  // 全markdownファイルの取得
  const postsDir = path.resolve(rootDir, config.paths.postsDir);
  const markdownFiles = await findMarkdownFiles(postsDir);

  // markdownファイルの処理
  // トップページの処理
}

export function parseMarkdown(markdown: string): string {
  return generator(parser(markdown));
}
