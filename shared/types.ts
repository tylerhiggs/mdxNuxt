import type { ThemedToken } from "shiki";
export type MdNode = {
  type:
    | "heading"
    | "paragraph"
    | "list-items"
    | "list-item"
    | "link"
    | "inline-code"
    | "image"
    | "callout"
    | "blockquote"
    | "code-block"
    | "bold"
    | "italic"
    | "text";
  raw: string;
  text?: string;
  depth?: number;
  href?: string;
  title?: string;
  language?: string;
  color?: ThemeColor;
  syntaxHighlightedTokens?: ThemedToken[][];
  items?: MdNode[];
};

export type ThemeColor =
  | "neutral"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";
