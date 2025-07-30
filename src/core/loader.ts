interface FrontMatterResult {
  data: Record<string, unknown>;
  content: string;
}

function parseFrontMatter(input: string): FrontMatterResult {
  const trimmedInput = input.trim();
  const match = trimmedInput.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {
      data: {},
      content: input,
    };
  }

  const rawYaml = match[1];
  const content = input.slice(match[0].length);

  const data: Record<string, string> = {};
  const lines = rawYaml.split("\n");

  for (const line of lines) {
    // 空行やコメントは無視
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed
      .slice(colonIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
      // 両端のクォートを除去

    data[key] = value;
  }

  return { data, content };
}
