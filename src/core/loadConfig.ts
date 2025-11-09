import path from "path";
import { MitarashiConfig } from "../types";
import { pathToFileURL } from "url";

export async function loadConfig(rootDir: string): Promise<MitarashiConfig> {
  const configPath = path.resolve(rootDir, "mitarashi.config.ts");
  const module = await import(pathToFileURL(configPath).href);
  return module.default;
}
