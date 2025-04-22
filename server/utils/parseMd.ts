import { MdNode } from "~/shared/types";

export function parseMd(markdown: string): MdNode[] {
  const lines = markdown.split("\n");
  const tokens: MdNode[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("#")) {
      const depth = trimmed.match(/^#+/)?.[0].length || 0;
      tokens.push({
        type: "heading",
        raw: line,
        text: trimmed.slice(depth).trim(),
        depth,
      });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      tokens.push({
        type: "list-item",
        raw: line,
        text: trimmed.slice(2).trim(),
      });
    } else if (trimmed.startsWith("[") && trimmed.includes("](")) {
      const match = trimmed.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        tokens.push({
          type: "link",
          raw: line,
          text: match[1],
          href: encodeURIComponent(match[2]),
        });
      }
    } else if (trimmed.includes("`")) {
      const match = trimmed.match(/`([^`]+)`/);
      if (match) {
        tokens.push({
          type: "inline-code",
          raw: line,
          text: match[1],
        });
      } else {
        tokens.push({
          type: "paragraph",
          raw: line,
          text: trimmed,
        });
      }
    } else if (trimmed.includes("**")) {
      const match = trimmed.match(/\*\*(.*?)\*\*/);
      if (match) {
        if (match.index) {
          tokens.push({
            type: "paragraph",
            raw: line,
            text: parseMd(trimmed.slice(0, match.index)),
          });
        }
        tokens.push({
          type: "bold",
          raw: line,
          text: match[1],
        });
      } else {
        tokens.push({
          type: "paragraph",
          raw: line,
          text: trimmed,
        });
      }
    } else if (trimmed.includes("*")) {
      const match = trimmed.match(/\*(.*?)\*/);
      if (match) {
        tokens.push({
          type: "italic",
          raw: line,
          text: match[1],
        });
      } else {
        tokens.push({
          type: "paragraph",
          raw: line,
          text: trimmed,
        });
      }
    } else if (trimmed) {
      tokens.push({
        type: "paragraph",
        raw: line,
        text: trimmed,
      });
    }
  });

  return tokens;
}
