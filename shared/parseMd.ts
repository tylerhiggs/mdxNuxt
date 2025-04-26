import type { MdNode } from "~/shared/types";
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
        items: parseLine(trimmed.slice(2).trim()),
      });
    } else if (trimmed) {
      tokens.push({
        type: "paragraph",
        raw: line,
        items: parseLine(trimmed),
      });
    }
  });

  return tokens;
}

/**
 *
 * @param mdLine Single line of markdown text, renders inline text only.
 * @returns list of MdNode objects representing the parsed line.
 * @example
 * ```ts
 * const line = "This is a paragraph with **bold text**, *italic text*, and __italic text__.";
 * const parsed = parseLine(line);
 * assert.equal(parsed, [
 *   { type: "text", raw: "This is a paragraph with ", text: "This is a paragraph with " },
 *   { type: "bold", raw: "**bold text**", text: "bold text" },
 *   { type: "text", raw: ", ", text: ", " },
 *   { type: "italic", raw: "*italic text*", text: "italic text" },
 *   { type: "text", raw: ", and ", text: ", and " },
 *   { type: "italic", raw: "__italic text__", text: "italic text" },
 *   { type: "text", raw: ".", text: "." }
 * ])
 */
export function parseLine(mdLine: string): MdNode[] {
  const tokens: MdNode[] = [];
  const parts = mdLine
    .split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|`.*?`|\[.*?\]\(.*?\))/g)
    .filter(Boolean);

  parts.forEach((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      tokens.push({
        type: "bold",
        raw: part,
        text: part.slice(2, -2),
      });
    } else if (part.startsWith("*") && part.endsWith("*")) {
      tokens.push({
        type: "italic",
        raw: part,
        text: part.slice(1, -1),
      });
    } else if (part.startsWith("__") && part.endsWith("__")) {
      tokens.push({
        type: "italic",
        raw: part,
        text: part.slice(2, -2),
      });
    } else if (part.startsWith("`") && part.endsWith("`")) {
      tokens.push({
        type: "inline-code",
        raw: part,
        text: part.slice(1, -1),
      });
    } else if (
      part.startsWith("[") &&
      part.includes("](") &&
      part.endsWith(")")
    ) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        tokens.push({
          type: "link",
          raw: part,
          text: match[1],
          href: encodeURIComponent(match[2]),
        });
      }
    } else {
      tokens.push({
        type: "text",
        raw: part,
        text: part,
      });
    }
  });

  return tokens;
}
