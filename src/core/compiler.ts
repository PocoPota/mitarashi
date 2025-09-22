import parser from "./parser";
import generator from "./generator";
import path from "path";
import fs from "fs/promises";
import { loadCondig } from "./loadConfig";
import { finder } from "./finder";
import { pageBuilder } from "./pageBuilder";

export async function buildSite(rootDir: string) {
  // 設定読み込み
  const config = await loadCondig(rootDir);

  // 出力ディレクトリを初期化
  const outputDir = path.resolve(rootDir, config.paths.outputDir);
  if (config.options.cleanOutputDir) {
    await fs.rm(outputDir, { recursive: true, force: true });
  }

  // 全markdownファイルの取得
  const postsDir = path.resolve(rootDir, config.paths.postsDir);
  const markdownFiles = await finder(postsDir);

  // markdownファイルの処理
  await Promise.all(
    markdownFiles.map(async (markdownFile) => {
      try {
        await pageBuilder(markdownFile, config, rootDir);
      } catch (e) {
        throw new Error(`ページの生成に失敗しました: ${e}`);
      }
    })
  );

  // トップページの処理
  
}
