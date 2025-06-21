import type { BadgeProps as UIBadgeProps } from "@nuxt/ui";
import type { ThemedToken } from "shiki";
export type AccordionProps = {
  type?: "single" | "multiple";
};
export type AccordionItemProps = {
  label?: string;
  icon?: string;
};
export type BadgeProps = UIBadgeProps;
export type CalloutProps = {
  icon?: string;
  color?: ThemeColor;
  link?: string;
};
export type CardProps = {
  title?: string;
  icon?: string;
  color?: ThemeColor;
  link?: string;
};
export type CodeCollapseProps = {
  icon?: string;
  open?: boolean;
  openText?: string;
  closeText?: string;
  name?: string;
};
export type CodeGroupProps = {
  defaultValue?: number | string;
};
export type CodeTreeProps = {
  defaultValue?: string;
};
export type ComponentProps =
  | AccordionItemProps
  | AccordionProps
  | BadgeProps
  | CalloutProps
  | CardProps
  | CodeCollapseProps
  | CodeGroupProps
  | CodeTreeProps;
export type ComponentType =
  | "accordion"
  | "accordion-item"
  | "badge"
  | "callout"
  | "card"
  | "card-group"
  | "code-collapse"
  | "code-group"
  | "code-tree"
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
  name?: string;
  color?: ThemeColor;
  syntaxHighlightedTokens?: ThemedToken[][];
  darkSyntaxHighlightedTokens?: ThemedToken[][];
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
