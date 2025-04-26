export type MdNode = {
  type:
    | "heading"
    | "paragraph"
    | "list-item"
    | "link"
    | "inline-code"
    | "bold"
    | "italic"
    | "text";
  raw: string;
  text?: string;
  depth?: number;
  href?: string;
  title?: string;
  items?: MdNode[];
};
