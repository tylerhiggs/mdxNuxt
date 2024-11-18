export type Page = {
  id: string;
  title: string;
  emoji: string;
  blocks: Block[];
  path: {
    id: string;
    title: string;
    emoji: string;
  }[];
  parent?: string;
  children?: string[];
  lastUpdatedAt: number;
  lastUpdatedByName: string;
  createdAt: number;
  createdByName: string;
  isPublic: boolean;
  isFavorite: boolean;
  deletedAt: number | false;
};

export type Block = {
  id: string;
  index: number;
  type: BlockType;
  textContent: TextNode[];
};

export type BlockType = "text" | "code" | "table";

export type TextNode = {
  id: string;
  types: TextNodeType[];
  content: string;
  tabs?: number;
  link?: string;
};

export type TextNodeType =
  | "bold"
  | "italic"
  | "strikethrough"
  | "link"
  | "inline-code"
  | "ol"
  | "ul"
  | "blockquote"
  | "h1"
  | "h2"
  | "h3";

export type PageUpdate = { id: string } & Partial<Omit<Page, "blocks">>;

export type PageItem = {
  id: string;
  title: string;
  emoji: string;
  isPublic: boolean;
  isFavorite: boolean;
  lastUpdatedAt: number;
  lastUpdatedByName: string;
};
