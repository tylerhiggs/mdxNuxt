import type { MdNode, ThemeColor } from "~/shared/types";
import {
  bundledLanguages,
  codeToTokens,
  type BundledLanguage,
  type ThemedToken,
} from "shiki";
import { sanitizeUrl } from "@braintree/sanitize-url";

/**
 *
 * Only run this on the client side, as it uses shiki to parse code blocks.
 *
 * @param markdown
 * @param lightMode
 * @returns
 */
export async function parseMd(
  markdown: string,
  lightMode = true,
): Promise<MdNode[]> {
  if (!import.meta.client) {
    console.error(
      "parseMd should only be called on the client side, as it uses shiki to parse code blocks.",
    );
    return [];
  }
  const lines = markdown.split("\n");
  const tokens: MdNode[] = [];
  let inCodeBlock = false;
  let codeBlockLanguage = "text" as BundledLanguage;
  let codeBlockContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        try {
          const { tokens: codeTokens } = await codeToTokens(
            codeBlockContent.join("\n"),
            {
              lang: codeBlockLanguage,
              theme: lightMode ? "vitesse-light" : "vitesse-dark",
            },
          );
          tokens.push({
            type: "code-block",
            raw: codeBlockContent.join("\n"),
            language: codeBlockLanguage,
            text: codeBlockContent.join("\n"),
            syntaxHighlightedTokens: codeTokens,
          });
        } catch (error) {
          console.error("Error parsing code block:", error);
          tokens.push({
            type: "code-block",
            raw: codeBlockContent.join("\n"),
            language: codeBlockLanguage,
            text: codeBlockContent.join("\n"),
          });
        }
        inCodeBlock = false;
        codeBlockLanguage = "text" as BundledLanguage;
        codeBlockContent = [];
      } else {
        // Start of code block
        inCodeBlock = true;
        const lang = trimmed.slice(3) as BundledLanguage;
        const langIsValid = lang in bundledLanguages;
        codeBlockLanguage = langIsValid ? lang : ("text" as BundledLanguage);
      }
    } else if (inCodeBlock) {
      codeBlockContent.push(line);
    } else if (trimmed.startsWith("---")) {
      // Horizontal rule
      tokens.push({
        type: "hr",
        raw: line,
      });
    } else if (trimmed.startsWith("#")) {
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
        depth: Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2),
        items: await parseLine(trimmed.slice(2).trim()),
      });
    } else if (/^\d+\.\s/.test(trimmed)) {
      tokens.push({
        type: "ordered-list-item",
        raw: line,
        depth: Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2),
        items: await parseLine(trimmed.replace(/^\d+\.\s/, "")),
      });
    } else if (trimmed.startsWith("> ")) {
      tokens.push({
        type: "blockquote",
        raw: line,
        items: await parseLine(trimmed.slice(2).trim()),
      });
    } else if (trimmed) {
      tokens.push({
        type: "paragraph",
        raw: line,
        items: await parseLine(trimmed),
      });
    }
  }

  return groupListItems(tokens);
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
export async function parseLine(mdLine: string): Promise<MdNode[]> {
  const tokens: MdNode[] = [];
  const parts = mdLine
    .split(
      /(\*\*.*?\*\*|\*.*?\*|__.*?__|`.*?`\{.*?\}|`.*?`|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))/g,
    )
    .filter(Boolean);

  for (const part of parts) {
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
    } else if (
      part.startsWith("`") &&
      part.includes("`{") &&
      part.endsWith("}")
    ) {
      const match = part.match(/`(.*?)`\{(.*?)\}/);
      let language: string | undefined;
      let color: ThemeColor | undefined;
      let syntaxHighlightedTokens: ThemedToken[][] | undefined;
      if (part.includes("lang")) {
        language = match?.[2].match(/lang=['"](\w+)['"]/)?.[1];
        if (language && bundledLanguages[language as BundledLanguage]) {
          const { tokens: codeTokens } = await codeToTokens(match?.[1] || "", {
            lang: language as BundledLanguage,
            theme: "vitesse-dark",
          });
          syntaxHighlightedTokens = codeTokens;
        }
      }
      if (part.includes("color")) {
        color = match?.[2].match(/color=['"](\w+)['"]/)?.[1] as ThemeColor;
      }
      tokens.push({
        type: "inline-code",
        raw: part,
        text: match?.[1],
        language,
        color,
        syntaxHighlightedTokens,
      });
    } else if (part.startsWith("`") && part.endsWith("`")) {
      tokens.push({
        type: "inline-code",
        raw: part,
        text: part.slice(1, -1),
      });
    } else if (
      part.startsWith("![") &&
      part.includes("](") &&
      part.endsWith(")")
    ) {
      const match = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        tokens.push({
          type: "image",
          raw: part,
          text: match[1],
          href: sanitizeUrl(match[2]),
        });
      }
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
          href: sanitizeUrl(match[2]),
        });
      }
    } else {
      tokens.push({
        type: "text",
        raw: part,
        text: part,
      });
    }
  }

  return tokens;
}

export function groupListItems(items: MdNode[]): MdNode[] {
  /**
   * If (so far in the computation) we have processed the following list:
   * ```html
   * <ul id="ul-1">
   *  <li>List item 1</li>
   *  <li>List item 2</li>
   *  <ul id="ul-2">
   *    <li>Nested item 1</li>
   *    <li>Nested item 2</li>
   *  </ul>
   * </ul>
   * ```
   * Then `prevListNodeStack === [Node(ul-1), Node(ul-2)]`
   */
  let prevListNodeStack: MdNode[] = [];
  return items.reduce((acc, node, i, arr) => {
    if (node.type !== "list-item" && node.type !== "ordered-list-item") {
      prevListNodeStack = []; // Reset stack if not a list item
      acc.push(node);
      return acc;
    }
    if (node.type === "list-item" || node.type === "ordered-list-item") {
      if (
        acc.length &&
        prevListNodeStack.length &&
        node.type === arr.at(i - 1)?.type &&
        (prevListNodeStack.at(-1)?.depth || 0) === (node.depth || 0)
      ) {
        if (prevListNodeStack.at(-1) && !prevListNodeStack.at(-1)?.items) {
          prevListNodeStack.at(-1)!.items = [];
        }
        prevListNodeStack.at(-1)?.items?.push(node);
        return acc;
      }
      if (
        acc.length &&
        prevListNodeStack.length &&
        node.type === arr.at(i - 1)?.type &&
        (prevListNodeStack.at(-1)?.depth || 0) > (node.depth || 0)
      ) {
        prevListNodeStack = prevListNodeStack.filter(
          (n) =>
            (n.depth || n.depth === 0) &&
            (node.depth || node.depth === 0) &&
            n.depth <= node.depth,
        );
        prevListNodeStack.at(-1)?.items?.push(node);
        return acc;
      }
      if (
        prevListNodeStack.length &&
        node.type === arr.at(i - 1)?.type &&
        (prevListNodeStack.at(-1)?.depth || 0) < (node.depth || 0)
      ) {
        // If the last item is a list-item and the current node is deeper, we need to push it into the last list-items node
        const previousListItem = arr.at(i - 1);
        if (!previousListItem) {
          console.warn(
            "Unexpected state: No previous list item found when trying to push a nested list item.",
          );
          return acc;
        }
        const newNode = {
          type: prevListNodeStack.at(-1)?.type || "list-items",
          raw: "",
          items: [node],
          depth: node.depth,
        };
        if (previousListItem.items) {
          previousListItem.items.push(newNode);
        } else {
          previousListItem.items = [newNode];
        }
        prevListNodeStack.push(newNode);
        return acc;
      }
      if (
        !acc.length ||
        (acc.at(-1)?.type !== "list-items" &&
          acc.at(-1)?.type !== "ordered-list-items")
      ) {
        acc.push(
          node?.type === "list-item"
            ? {
                type: "list-items",
                raw: "",
                items: [],
                depth: 0,
              }
            : {
                type: "ordered-list-items",
                raw: "",
                items: [],
                depth: 0,
                orderedListStartIndex: node.raw.match(/^\d+/)
                  ? parseInt(node.raw.match(/^\d+/)![0], 10)
                  : 1,
              },
        );
        prevListNodeStack.push(acc.at(-1)!);
      }
      acc[acc.length - 1]?.items?.push(node);
    } else {
      acc.push(node);
    }
    return acc;
  }, [] as MdNode[]);
}
