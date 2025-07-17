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
  expandAll?: boolean;
};
export type CollapsibleProps = {
  icon?: string;
  name?: string;
  openText?: string;
  closeText?: string;
};
export type FieldProps = {
  name?: string;
  type?: string;
  required?: boolean;
};
export type IconProps = {
  name: string;
};
export type KbdProps = {
  value: string;
};
export type TabItemProps = {
  label: string;
  icon?: string;
};
export type StepperProps = {
  level?: number | string;
};
export type ComponentProps =
  | AccordionItemProps
  | AccordionProps
  | BadgeProps
  | CalloutProps
  | CardProps
  | CodeCollapseProps
  | CodeGroupProps
  | CodeTreeProps
  | CollapsibleProps
  | FieldProps
  | IconProps
  | KbdProps;
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
  | "collapsible"
  | "field"
  | "field-group"
  | "icon"
  | "kbd"
  | "tabs"
  | "tabs-item"
  | "steps"
  | "note"
  | "tip"
  | "warning"
  | "caution";
export type MdNodeType =
  | "section"
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
  | "strikethrough"
  | "highlighted"
  | "sup"
  | "sub"
  | "hr"
  | "table"
  | "text";

export type BaseMdNode = {
  type: MdNodeType | ComponentType;
  id: string;
};
export type SectionNode = BaseMdNode & {
  type: "section";
  items: MdNode[];
  headingId: string; // The title is the heading text, which should be the first item in the section
};
export type HeadingNode = BaseMdNode & {
  type: "heading";
  depth: number;
  items: MdNode[];
};
export type ParagraphNode = BaseMdNode & {
  type: "paragraph";
  items: MdNode[];
};
export type ListItemsNode = BaseMdNode & {
  type: "list-items";
  items: MdNode[];
  depth: number;
};
export type ListItemNode = BaseMdNode & {
  type: "list-item";
  items: MdNode[];
  depth: number;
};
export type OrderedListItemsNode = BaseMdNode & {
  type: "ordered-list-items";
  items: MdNode[];
  orderedListStartIndex?: number;
  depth: number;
};
export type OrderedListItemNode = BaseMdNode & {
  type: "ordered-list-item";
  items: MdNode[];
  orderedListStartIndex?: number;
  depth: number;
  number: number; // for ordered lists, the number to display
};
export type LinkNode = BaseMdNode & {
  type: "link";
  href: string;
  title?: string;
};
export type InlineCodeNode = BaseMdNode & {
  type: "inline-code";
  language?: string;
  color?: ThemeColor;
  text?: string; // if not using syntax highlighting
  syntaxHighlightedTokens?: ThemedToken[][];
  darkSyntaxHighlightedTokens?: ThemedToken[][];
};
export type ImageNode = BaseMdNode & {
  type: "image";
  href: string;
  title: string;
};
export type BlockquoteNode = BaseMdNode & {
  type: "blockquote";
  items: MdNode[];
};
export type CodeBlockNode = BaseMdNode & {
  type: "code-block";
  language?: string;
  name?: string;
  syntaxHighlightedTokens?: ThemedToken[][];
  darkSyntaxHighlightedTokens?: ThemedToken[][];
};
export type BoldNode = BaseMdNode & {
  type: "bold";
  items: MdNode[];
};
export type ItalicNode = BaseMdNode & {
  type: "italic";
  items: MdNode[];
};
export type StrikethroughNode = BaseMdNode & {
  type: "strikethrough";
  items: MdNode[];
};
export type HighlightedNode = BaseMdNode & {
  type: "highlighted";
  items: MdNode[];
};
export type SupNode = BaseMdNode & {
  type: "sup";
  items: MdNode[];
};
export type SubNode = BaseMdNode & {
  type: "sub";
  items: MdNode[];
};
export type HrNode = BaseMdNode & {
  type: "hr";
};
export type TextNode = BaseMdNode & {
  type: "text";
  text: string;
};
export type TableNode = BaseMdNode & {
  type: "table";
  headers?: MdNode[][];
  rows: MdNode[][][];
  align: ("left" | "center" | "right")[];
};
export type ComponentNode = BaseMdNode & {
  type: ComponentType;
  componentProps?: ComponentProps;
  items: MdNode[];
};
export type MdNode =
  | SectionNode
  | HeadingNode
  | ParagraphNode
  | ListItemsNode
  | ListItemNode
  | OrderedListItemsNode
  | OrderedListItemNode
  | LinkNode
  | InlineCodeNode
  | ImageNode
  | BlockquoteNode
  | CodeBlockNode
  | BoldNode
  | ItalicNode
  | StrikethroughNode
  | HighlightedNode
  | SupNode
  | SubNode
  | HrNode
  | TableNode
  | TextNode
  | ComponentNode;

export type ThemeColor =
  | "neutral"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "primary"
  | "secondary";

export type HeadingOutlineItem = {
  id: string;
  label: string;
  depth: number;
  items: HeadingOutlineItem[];
};
