import type { ThemedToken } from "shiki";
export type MdNodeType =
  | "heading"
  | "paragraph"
  | "list-items"
  | "list-item"
  | "ordered-list-items"
  | "ordered-list-item"
  | "link"
  | "inline-code"
  | "image"
  | "callout"
  | "blockquote"
  | "code-block"
  | "bold"
  | "italic"
  | "hr"
  | "text";
export type MdNode = {
  type: MdNodeType;
  raw: string;
  text?: string;
  depth?: number;
  href?: string;
  title?: string;
  language?: string;
  color?: ThemeColor;
  syntaxHighlightedTokens?: ThemedToken[][];
  items?: MdNode[];
  orderedListStartIndex?: number;
};

export type ThemeColor =
  | "neutral"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";
