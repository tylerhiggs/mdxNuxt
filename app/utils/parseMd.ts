import type {
  ComponentNode,
  ComponentProps,
  ComponentType,
  ListItemNode,
  ListItemsNode,
  MdNode,
  OrderedListItemNode,
  OrderedListItemsNode,
  SectionNode,
  TableNode,
  ThemeColor,
} from "~~/shared/types";
import { bundledLanguages, codeToTokens } from "shiki";
import type { BundledLanguage, ThemedToken } from "shiki";
import katex from "katex";
import { sanitizeUrl } from "@braintree/sanitize-url";
import DOMPurify from "dompurify";

/**
 *
 * Only run this on the client side, as it uses shiki to parse code blocks.
 *
 * Parses a markdown + component string into a structured array of MdNode objects.
 * * Markdown is parsed into headings, paragraphs, lists, code blocks, etc.
 * * Components such as accordions, notes, tips, warnings, and cautions are parsed into their respective MdNode types.
 *
 * @param markdown
 * @param lightMode
 * @returns
 */
export async function parseMd(markdown: string): Promise<MdNode[]> {
  if (import.meta.server) {
    console.error(
      "parseMd should only be called on the client side, as it uses shiki to parse code blocks.",
    );
    return [];
  }
  const tokens: MdNode[] = [];
  // Stack to keep track of nested components
  const componentStack: (MdNode & { items: MdNode[] })[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let inTable = false;
  let tableContent: TableNode | null = null; // Track the current table being parsed
  let codeBlockLanguage = "text" as BundledLanguage;
  let name: string | undefined;
  let codeBlockContent: string[] = [];
  let codeBlockFence: string | null = null; // Track the current fence (``` or ````)

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();

    const lastComponent = componentStack.at(-1);
    const listToPushTo =
      lastComponent && lastComponent.items ? lastComponent.items : tokens;
    // Detect code block start/end (support both ``` and ````)
    const fenceMatch = trimmed.match(/^(`{3,4})([\w-]+)?(?:\s*\[([^\]]+)\])?/);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      if (inCodeBlock && codeBlockFence === fence) {
        // End of code block
        try {
          const { tokens: codeTokens } = await codeToTokens(
            codeBlockContent.join("\n"),
            {
              lang: codeBlockLanguage,
              theme: "material-theme-lighter",
            },
          );
          const { tokens: darkCodeTokens } = await codeToTokens(
            codeBlockContent.join("\n"),
            {
              lang: codeBlockLanguage,
              theme: "material-theme-palenight",
            },
          );
          listToPushTo.push({
            id: `${index}-${codeBlockContent.join("\n").slice(0, 20)}`,
            type: "code-block",
            language: codeBlockLanguage,
            name,
            syntaxHighlightedTokens: codeTokens,
            darkSyntaxHighlightedTokens: darkCodeTokens,
          });
        } catch (error) {
          console.error("Error parsing code block:", error);
        }
        inCodeBlock = false;
        codeBlockLanguage = "text" as BundledLanguage;
        codeBlockContent = [];
        codeBlockFence = null;
      } else if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockFence = fence || null;
        const lang =
          (fenceMatch?.[2] as BundledLanguage) || ("text" as BundledLanguage);
        name = fenceMatch?.[3];
        const langIsValid = lang in bundledLanguages;
        codeBlockLanguage = langIsValid ? lang : ("text" as BundledLanguage);
        codeBlockContent = [];
      } else {
        codeBlockContent.push(line);
      }
      continue;
    }
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
      // Inline math block
      const content = katex.renderToString(
        DOMPurify.sanitize(trimmed.slice(2, -2)),
        {
          throwOnError: false,
        },
      );
      listToPushTo.push({
        id: `${index}-block-math`,
        type: "block-math",
        content,
      });
      continue;
    }

    if (trimmed === "::") {
      // End of component
      const component = componentStack.pop();
      if (component) {
        component.items = groupListItems(component.items);
      }
      continue;
    }
    if (trimmed.startsWith("::")) {
      // Component start
      const match = trimmed.match(/^::([\w-]+)(?:\{(.*?)\})?$/);
      if (match) {
        const componentType = match[1] as ComponentType;
        const componentProps = match[2] ? getProps(match[2]) : {};
        const componentNode: MdNode = {
          id: `${index}-${match[1]}-${match[2] || ""}`,
          type: componentType,
          items: [],
          componentProps: componentProps as ComponentProps,
        };
        listToPushTo.push(componentNode);
        componentStack.push(componentNode);
      }
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Table row or header
      if (!inTable) {
        // Start of table
        inTable = true;
        tableContent = {
          id: `${index}-table`,
          type: "table",
          headers: [],
          rows: [],
          align: [],
        };
        const headerCells = trimmed
          .split(/(?<!`)\|(?=(?:[^`]*`[^`]*`)*[^`]*$)/) // Split by | unless inside backticks
          .slice(1, -1)
          .map((cell) => parseLine(cell.trim()));
        const parsedCells = await Promise.all(headerCells);
        tableContent.headers = [...parsedCells];
        continue;
      }

      if (/^\s*\|?[\s:-]+\|[\s|:-]*$/.test(trimmed) && tableContent) {
        // Table header separator - find alignment
        const align = trimmed
          .split(/(?<!`)\|(?=(?:[^`]*`[^`]*`)*[^`]*$)/) // Split by | unless inside backticks
          .slice(1, -1)
          .map((cell) => {
            if (/^\s*:-+:\s*$/.test(cell)) {
              return "center";
            } else if (/^\s*-+:\s*$/.test(cell)) {
              return "right";
            } else if (/^\s*:-+\s*$/.test(cell) || /^\s*-+\s*$/.test(cell)) {
              return "left";
            }
            return "left";
          });
        tableContent.align = [...align];
        continue;
      }
      const rowCells = trimmed
        .split(/(?<!`)\|(?=(?:[^`]*`[^`]*`)*[^`]*$)/) // Split by | unless inside backticks
        .slice(1, -1)
        .map((cell) => parseLine(cell.trim()));
      const parsedCells = await Promise.all(rowCells);
      if (tableContent) {
        tableContent.rows.push(parsedCells);
        if (
          index === lines.length - 1 ||
          !lines[index + 1]?.trim().startsWith("|")
        ) {
          listToPushTo.push({ ...tableContent });
          tableContent = null; // Reset table content for next table
          inTable = false; // End of table
        }
      }
      continue;
    }

    if (inTable && tableContent) {
      listToPushTo.push(tableContent);
      inTable = false; // End of table
      tableContent = null;
    }

    if (trimmed.startsWith("---")) {
      // Horizontal rule
      tokens.push({
        id: `${index}-hr`,
        type: "hr",
      });
    } else if (trimmed.startsWith("#")) {
      const depth = trimmed.match(/^#+/)?.[0].length || 0;
      listToPushTo.push({
        id: `${trimmed.slice(depth)}-${index}-h${depth}`,
        type: "heading",
        depth,
        items: await parseLine(trimmed.slice(depth).trim()),
      });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listToPushTo.push({
        id: `${index}-li-${trimmed}`,
        type: "list-item",
        depth: Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2),
        items: await parseLine(trimmed.slice(2).trim()),
      });
    } else if (/^\d+\.\s/.test(trimmed)) {
      listToPushTo.push({
        id: `${index}-ol-${trimmed}`,
        type: "ordered-list-item",
        depth: Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2),
        items: await parseLine(trimmed.replace(/^\d+\.\s/, "")),
        number: parseInt(trimmed.match(/^\d+/)?.[0] || "1", 10),
      });
    } else if (trimmed.startsWith("> ")) {
      listToPushTo.push({
        id: `${index}-blockquote-${trimmed}`,
        type: "blockquote",
        items: await parseLine(trimmed.slice(2).trim()),
      });
    } else if (trimmed) {
      listToPushTo.push({
        id: `${index}-p-${trimmed}`,
        type: "paragraph",
        items: await parseLine(trimmed),
      });
    }
  }

  return groupSections(groupListItems(tokens));
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
      /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|==.*?==|~.*?~|\$.*?\$|\^.*?\^|`.*?`\{.*?\}|`.*?`|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|:[\w-]+\{.*?\}|https?:\/\/[^\s<>"'`]*[^\s<>"'`.,;:!?)]?)/g,
    )
    .filter(Boolean);

  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      tokens.push({
        id: `bold-${part.slice(2, -2)}`,
        type: "bold",
        items: await parseLine(part.slice(2, -2)),
      });
    } else if (part.startsWith("*") && part.endsWith("*")) {
      tokens.push({
        id: `italic-${part.slice(1, -1)}`,
        type: "italic",
        items: await parseLine(part.slice(1, -1)),
      });
    } else if (part.startsWith("__") && part.endsWith("__")) {
      tokens.push({
        id: `italic-${part.slice(2, -2)}`,
        type: "italic",
        items: await parseLine(part.slice(2, -2)),
      });
    } else if (part.startsWith("~~") && part.endsWith("~~")) {
      tokens.push({
        id: `strikethrough-${part.slice(2, -2)}`,
        type: "strikethrough",
        items: await parseLine(part.slice(2, -2)),
      });
    } else if (part.startsWith("==") && part.endsWith("==")) {
      tokens.push({
        id: `highlighted-${part.slice(2, -2)}`,
        type: "highlighted",
        items: await parseLine(part.slice(2, -2)),
      });
    } else if (part.startsWith("~") && part.endsWith("~")) {
      tokens.push({
        id: `sub-${part.slice(1, -1)}`,
        type: "sub",
        items: await parseLine(part.slice(1, -1)),
      });
    } else if (part.startsWith("$") && part.endsWith("$")) {
      const renderedMath = katex.renderToString(
        DOMPurify.sanitize(part.slice(1, -1)),
        {
          throwOnError: false,
        },
      );
      tokens.push({
        id: `inline-math-${part.slice(1, -1)}`,
        type: "inline-math",
        content: renderedMath,
      });
    } else if (part.startsWith("^") && part.endsWith("^")) {
      tokens.push({
        id: `sup-${part.slice(1, -1)}`,
        type: "sup",
        items: await parseLine(part.slice(1, -1)),
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
      let darkSyntaxHighlightedTokens: ThemedToken[][] | undefined;
      if (part.includes("lang")) {
        language = match?.[2]?.match(/lang=['"]([\w-#+]+)['"]/)?.[1];
        if (language) {
          if (language.startsWith("ts-")) {
            language = "typescript";
          }
          if (!bundledLanguages[language as BundledLanguage]) {
            console.warn(
              `parseMd: Unsupported language "${language}". Falling back to "text".`,
            );
            language = "text";
          }
          const { tokens: codeTokens } = await codeToTokens(match?.[1] || "", {
            lang: language as BundledLanguage,
            theme: "material-theme-lighter",
          });
          const { tokens: darkCodeTokens } = await codeToTokens(
            match?.[1] || "",
            {
              lang: language as BundledLanguage,
              theme: "material-theme-palenight",
            },
          );
          syntaxHighlightedTokens = codeTokens;
          darkSyntaxHighlightedTokens = darkCodeTokens;
        }
      }
      if (part.includes("color")) {
        color = match?.[2]?.match(/color=['"](\w+)['"]/)?.[1] as ThemeColor;
      }
      tokens.push({
        id: `inline-code-${part.slice(1, -1)}`,
        type: "inline-code",
        text: match?.[1] || "",
        language,
        color,
        syntaxHighlightedTokens,
        darkSyntaxHighlightedTokens,
      });
    } else if (part.startsWith("`") && part.endsWith("`")) {
      tokens.push({
        id: `inline-code-${part.slice(1, -1)}`,
        type: "inline-code",
        text: part.slice(1, -1),
      });
    } else if (/:[\w-]+\{.*?\}/.test(part)) {
      // inline component without child items
      const match = part.match(/:(\w+)(?:\{(.*?)\})?/);
      if (match) {
        const componentType = match[1] as ComponentType;
        // Check if the component type is valid
        const componentProps = match[2] ? getProps(match[2]) : {};
        const componentNode: ComponentNode = {
          id: `component-${componentType}-${match[2] || ""}`,
          type: componentType,
          items: [],
          componentProps: componentProps as ComponentProps,
        };
        tokens.push(componentNode);
        continue;
      }
    } else if (
      part.startsWith("![") &&
      part.includes("](") &&
      part.endsWith(")")
    ) {
      const match = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        tokens.push({
          id: `image-${match[1]}-${match[2]}`,
          type: "image",
          title: match[1] || "",
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
          id: `link-${match[1]}-${match[2]}`,
          type: "link",
          title: match[1],
          href: sanitizeUrl(match[2]),
        });
      }
    } else if (part.startsWith("http://") || part.startsWith("https://")) {
      if (part.startsWith("https://www.youtube.com/watch?v=")) {
        // Handle YouTube links
        const videoId = sanitizeUrl(part.split("v=")[1]?.split("&")[0]);
        tokens.push({
          id: `youtube-${videoId}`,
          type: "youtube",
          videoId,
        });
        continue;
      }
      // Handle plain URLs
      tokens.push({
        id: `link-${part}`,
        type: "link",
        title: part,
        href: sanitizeUrl(part),
      });
    } else {
      tokens.push({
        id: `text-${part}`,
        type: "text",
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
  let prevListNodeStack: (ListItemsNode | OrderedListItemsNode)[] = [];
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
        const previousListItem = arr.at(i - 1) as
          | ListItemNode
          | OrderedListItemNode;
        if (!previousListItem) {
          console.warn(
            "Unexpected state: No previous list item found when trying to push a nested list item.",
          );
          return acc;
        }
        const newNode: ListItemsNode | OrderedListItemsNode = {
          id: `${node.id}-nested`,
          type: prevListNodeStack.at(-1)?.type || "list-items",
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
        const newListNode: ListItemsNode | OrderedListItemsNode =
          node?.type === "list-item"
            ? {
                id: `${node.id}-list-items`,
                type: "list-items",
                items: [],
                depth: 0,
              }
            : {
                id: `${node.id}-ordered-list-items`,
                type: "ordered-list-items",
                items: [],
                depth: 0,
                orderedListStartIndex: node.number,
              };
        acc.push(newListNode);
        prevListNodeStack.push(newListNode);
      }
      (acc.at(-1) as ListItemsNode | OrderedListItemsNode)?.items?.push(node);
    } else {
      acc.push(node);
    }
    return acc;
  }, [] as MdNode[]);
}

const getProps = (props: string) => {
  // Match key="value", key='value', key=value (unquoted), or key (no value)
  const regex = /(\w+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s,]+)))?/g;
  const result: Record<string, string | boolean | number> = {};
  let match: RegExpExecArray | null;
  while ((match = regex.exec(props))) {
    const key = match[1];
    if (!key) continue; // Skip if no key is found
    const value = match[2] ?? match[3] ?? match[4];
    // If value is undefined, treat as boolean true
    let parsed: string | boolean | number | undefined = value;
    if (parsed === undefined) parsed = true;
    else if (parsed === "true") parsed = true;
    else if (parsed === "false") parsed = false;
    else if (!isNaN(Number(parsed))) parsed = Number(parsed);
    result[key] = parsed;
  }
  return result;
};

const groupSections = (nodes: MdNode[]): MdNode[] => {
  let currentSection: SectionNode | null = null; // Track the current section being parsed

  return nodes.reduce((acc, node) => {
    if (node.type === "heading") {
      currentSection = {
        id: `section-${node.id}`,
        type: "section",
        headingId: node.id,
        items: [node],
      };
      acc.push(currentSection);
    } else if (currentSection) {
      currentSection.items.push(node);
    } else {
      // If no current section, just push the node
      acc.push(node);
    }
    return acc;
  }, [] as MdNode[]);
};
