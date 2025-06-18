import type { ThemedToken } from "shiki";
export type AccordianItemProps = {
  label: string;
  icon: string;
};
export type ComponentProps = AccordianItemProps;
export type ComponentType =
  | "accordian"
  | "callout"
  | "note"
  | "tip"
  | "warning"
  | "caution";
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
  | "blockquote"
  | "code-block"
  | "bold"
  | "italic"
  | "hr"
  | "text";
export type MdNode = {
  type: MdNodeType | ComponentType;
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
  componentProps?: ComponentProps;
};

export type ThemeColor =
  | "neutral"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";
