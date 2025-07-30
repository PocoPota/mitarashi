import parser from "./parser";
import generator from "./generator";

export function parseMarkdown(markdown: string): string {
  return generator(parser(markdown));
}
