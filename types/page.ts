import type { MdNode } from "~/shared/types";

export type Page = {
  id: number;
  title: string;
  emoji: string;
  blocks: Block[];
  path: {
    id: number;
    title: string;
    emoji: string;
  }[];
  parentId: number | null;
  children?: string[];
  lastUpdatedAt: number;
  lastUpdatedByName: string;
  createdAt: number;
  createdByName: string;
  isPublic: boolean;
  isFavorite: boolean;
  deletedAt: string | null;
};

export type Block = {
  id: number;
  index: number;
  type: BlockType;
  textContent: string;
  renderedMd?: MdNode[];
};

export type BlockType = "text" | "table" | "callout" | "image" | "code";

export type PageUpdate = { id: number } & Partial<Omit<Page, "blocks">>;
export type BlockUpdate = {
  pageId: number;
  blockId: number;
  textContent: string;
};

export type PageItem = {
  id: number;
  title: string;
  emoji: string;
  isPublic: boolean;
  isFavorite: boolean;
  lastUpdatedAt: number;
  lastUpdatedByName: string;
};
