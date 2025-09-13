import fs from "fs/promises";
import path from "path";

export async function finder(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return finder(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      } else {
        return [];
      }
    })
  );
  return files.flat();
}
