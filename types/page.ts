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
  textContent: string;
};

export type BlockType = "text" | "table";

export type PageUpdate = { id: string } & Partial<Omit<Page, "blocks">>;
export type BlockUpdate = {
  pageId: string;
  blockId: string;
  textContent: string;
};

export type PageItem = {
  id: string;
  title: string;
  emoji: string;
  isPublic: boolean;
  isFavorite: boolean;
  lastUpdatedAt: number;
  lastUpdatedByName: string;
};
